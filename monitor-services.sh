#!/bin/bash

# Gardenia 2025 Service Monitor and Auto-Recovery Script
# This script checks if frontend and backend services are running and restarts them if needed

LOG_FILE="/var/log/gardenia-monitor.log"
MAX_RESTARTS=3

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Logging function
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
    echo -e "$1"
}

# Check if service is responding
check_service() {
    local service_name=$1
    local port=$2
    local url=$3

    if curl -f -s "$url" > /dev/null 2>&1; then
        log "${GREEN}✅ $service_name is responding on port $port${NC}"
        return 0
    else
        log "${RED}❌ $service_name is not responding on port $port${NC}"
        return 1
    fi
}

# Check PM2 process status
check_pm2_process() {
    local service_name=$1

    if pm2 jlist | jq -e ".[] | select(.name == \"$service_name\") | .pm2_env.status" > /dev/null 2>&1; then
        local status=$(pm2 jlist | jq -r ".[] | select(.name == \"$service_name\") | .pm2_env.status")
        if [[ "$status" == "online" ]]; then
            log "${GREEN}✅ PM2 process $service_name is online${NC}"
            return 0
        else
            log "${YELLOW}⚠️ PM2 process $service_name status: $status${NC}"
            return 1
        fi
    else
        log "${RED}❌ PM2 process $service_name not found${NC}"
        return 1
    fi
}

# Restart service
restart_service() {
    local service_name=$1
    local restart_count_file="/tmp/${service_name}_restart_count"

    # Check restart count
    local restart_count=0
    if [[ -f "$restart_count_file" ]]; then
        restart_count=$(cat "$restart_count_file")
    fi

    if [[ $restart_count -ge $MAX_RESTARTS ]]; then
        log "${RED}❌ $service_name has exceeded max restarts ($MAX_RESTARTS). Manual intervention required.${NC}"
        return 1
    fi

    log "${YELLOW}🔄 Restarting $service_name (attempt $((restart_count + 1))/$MAX_RESTARTS)...${NC}"

    if pm2 restart "$service_name" > /dev/null 2>&1; then
        log "${GREEN}✅ Successfully restarted $service_name${NC}"
        echo $((restart_count + 1)) > "$restart_count_file"
        return 0
    else
        log "${RED}❌ Failed to restart $service_name${NC}"
        return 1
    fi
}

# Reset restart count after successful run
reset_restart_count() {
    local service_name=$1
    local restart_count_file="/tmp/${service_name}_restart_count"

    if [[ -f "$restart_count_file" ]]; then
        rm "$restart_count_file"
        log "${GREEN}🔄 Reset restart count for $service_name${NC}"
    fi
}

# Main monitoring function
main() {
    log "${GREEN}🔍 Starting Gardenia 2025 service monitoring...${NC}"

    local issues_found=0

    # Check backend service
    if ! check_pm2_process "gardenia2025-backend"; then
        if ! restart_service "gardenia2025-backend"; then
            ((issues_found++))
        fi
    else
        reset_restart_count "gardenia2025-backend"
    fi

    # Wait a moment for backend to start
    sleep 3

    # Check backend health endpoint
    if ! check_service "Backend API" "5000" "http://localhost:5000/api/health"; then
        if ! restart_service "gardenia2025-backend"; then
            ((issues_found++))
        fi
    fi

    # Check frontend service
    if ! check_pm2_process "gardenia2025-frontend"; then
        if ! restart_service "gardenia2025-frontend"; then
            ((issues_found++))
        fi
    else
        reset_restart_count "gardenia2025-frontend"
    fi

    # Wait a moment for frontend to start
    sleep 2

    # Check frontend service
    if ! check_service "Frontend" "3001" "http://localhost:3001"; then
        if ! restart_service "gardenia2025-frontend"; then
            ((issues_found++))
        fi
    fi

    # Check nginx status
    if ! systemctl is-active --quiet nginx; then
        log "${YELLOW}⚠️ Nginx is not running, attempting to restart...${NC}"
        if systemctl restart nginx; then
            log "${GREEN}✅ Nginx restarted successfully${NC}"
        else
            log "${RED}❌ Failed to restart nginx${NC}"
            ((issues_found++))
        fi
    else
        log "${GREEN}✅ Nginx is running${NC}"
    fi

    # Summary
    if [[ $issues_found -eq 0 ]]; then
        log "${GREEN}🎉 All services are healthy!${NC}"
    else
        log "${RED}⚠️ Found $issues_found issue(s) that need attention${NC}"
    fi

    log "${GREEN}📊 Service monitoring completed${NC}"
}

# Run main function
main
