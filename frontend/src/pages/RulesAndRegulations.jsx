import { useState, useMemo } from 'react';

const RulesAndRegulations = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const sections = [
    { id: 'general', label: 'General Rules', icon: '📋', category: 'General' },
    { id: 'performance', label: 'Performance Guidelines', icon: '🎭', category: 'Performance' },
    { id: 'scoring', label: 'Scoring Criteria', icon: '⭐', category: 'Evaluation' },
    { id: 'disqualification', label: 'Disqualification', icon: '⚠️', category: 'Penalties' },
    { id: 'sports', label: 'Sports Rules', icon: '🏆', category: 'Sports' }
  ];

  const categories = [
    { key: 'All', label: 'All Categories' },
    { key: 'General', label: 'General' },
    { key: 'Performance', label: 'Performance' },
    { key: 'Evaluation', label: 'Evaluation' },
    { key: 'Penalties', label: 'Penalties' },
    { key: 'Sports', label: 'Sports' }
  ];

  const generalRules = [
    {
      title: "Eligibility",
      content: "Open to all students of Classes 9, 10, 11, 12 (PU), UG, and PG."
    },
    {
      title: "Categories",
      content: "Events may be solo, duo, or team-based depending on event guidelines."
    },
    {
      title: "Language",
      content: "English is the medium of communication unless specified; songs, performances, or readings may be in any language but must be appropriate and respectful."
    },
    {
      title: "Theme Adherence",
      content: "All performances, artworks, and ideas must align with the festival themes:",
      subItems: [
        "Neo-Tribe – Find Your Clan (Flagship Events)",
        "Elements – Live the Essence (Signature Events)",
        "Arena – Play for Glory"
      ]
    },
    {
      title: "Time Limit",
      content: "Each participant/team must adhere to event-specific time limits. Exceeding time will lead to penalties or disqualification."
    },
    {
      title: "Originality",
      content: "All entries must be original. Plagiarism, copying, or use of pre-prepared content/artwork without disclosure is prohibited."
    },
    {
      title: "Conduct",
      content: "Participants must maintain discipline, sportsmanship, and respect towards organizers, judges, and fellow participants."
    },
    {
      title: "ID Requirement",
      content: "Valid School/College ID is mandatory for participation."
    }
  ];

  const performanceGuidelines = [
    "Participants must report at least 30 minutes before the scheduled start of their event.",
    "Required materials (instruments, costumes, props, paints, laptops, etc.) must be arranged by participants unless specified by organizers.",
    "Technical requirements (music tracks, PPTs, videos) must be submitted in advance as per organizer deadlines.",
    "Safety must be ensured—no use of fire, water, powder, sharp objects, or hazardous materials unless explicitly permitted.",
    "Collaboration between teams or external assistance is strictly prohibited.",
    "Judges' decisions will be final and binding in all matters of scoring and results."
  ];

  const scoringCriteria = [
    "Relevance to Theme",
    "Creativity & Innovation",
    "Skill / Technique",
    "Presentation / Stage Presence",
    "Time Management",
    "Teamwork (for group events)"
  ];

  const disqualificationGrounds = [
    "Use of vulgar, abusive, or inappropriate language/content.",
    "Misconduct, cheating, or unfair means.",
    "Exceeding the time limit by more than 30 seconds (unless specified otherwise).",
    "Failure to report on time or absence during scheduled slot.",
    "Use of banned props, unsafe behaviour, or damage to venue property."
  ];

  const sportsRules = [
    "Federation rules will be followed for all games.",
    "Only certified and bonafide students are eligible (list signed by Principal/PED).",
    "ID cards are compulsory; absence leads to disqualification.",
    "Proper team attire is mandatory.",
    "University is not responsible for loss of belongings.",
    "Discipline must be maintained at all times.",
    "Teams must be accompanied by PED/College Staff/Manager.",
    "Report to the venue at least 30 minutes before the scheduled match.",
    "Fixtures will be given to captains a day before; no changes allowed.",
    "Organizers may amend rules if required.",
    "Food & accommodation will be provided.",
    "Registration closes at 20 teams, even before the last date.",
    "Participants must be under 25 years of age as on 27th February 2025.",
    "Matches will not be postponed except for valid natural causes (rain, bad light, etc.)."
  ];

  // Filter sections based on search term and category
  const filteredSections = useMemo(() => {
    return sections.filter(section => {
      const matchesCategory = selectedCategory === 'All' || section.category === selectedCategory;
      const matchesSearch = searchTerm === '' || 
        section.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        section.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

  // Get all content for search functionality
  const getAllContent = () => {
    const allContent = [];
    
    // Add general rules
    generalRules.forEach((rule, index) => {
      allContent.push({
        section: 'general',
        sectionLabel: 'General Rules',
        title: rule.title,
        content: rule.content,
        subItems: rule.subItems,
        type: 'rule'
      });
    });

    // Add performance guidelines
    performanceGuidelines.forEach((guideline, index) => {
      allContent.push({
        section: 'performance',
        sectionLabel: 'Performance Guidelines',
        title: `Guideline ${index + 1}`,
        content: guideline,
        type: 'guideline'
      });
    });

    // Add scoring criteria
    scoringCriteria.forEach((criterion, index) => {
      allContent.push({
        section: 'scoring',
        sectionLabel: 'Scoring Criteria',
        title: criterion,
        content: '',
        type: 'criterion'
      });
    });

    // Add disqualification grounds
    disqualificationGrounds.forEach((ground, index) => {
      allContent.push({
        section: 'disqualification',
        sectionLabel: 'Disqualification',
        title: `Ground ${index + 1}`,
        content: ground,
        type: 'ground'
      });
    });

    // Add sports rules
    sportsRules.forEach((rule, index) => {
      allContent.push({
        section: 'sports',
        sectionLabel: 'Sports Rules',
        title: `Rule ${index + 1}`,
        content: rule,
        type: 'sportsRule'
      });
    });

    return allContent;
  };

  // Filter content based on search term
  const filteredContent = useMemo(() => {
    if (searchTerm === '') return [];
    
    const allContent = getAllContent();
    return allContent.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sectionLabel.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const renderSearchResults = () => {
    if (filteredContent.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No results found</h3>
          <p className="text-gray-500">Try adjusting your search terms or browse by category.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Search Results ({filteredContent.length} found)
          </h3>
          <div className="w-20 h-1 bg-primary-600 rounded-full"></div>
        </div>
        
        {filteredContent.map((item, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <span className="bg-primary-100 text-primary-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  {index + 1}
                </span>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">{item.title}</h4>
                  <span className="text-sm text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
                    {item.sectionLabel}
                  </span>
                </div>
              </div>
            </div>
            {item.content && (
              <p className="text-gray-700 leading-relaxed ml-11">{item.content}</p>
            )}
            {item.subItems && (
              <ul className="mt-4 space-y-2 ml-11">
                {item.subItems.map((subItem, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-primary-500 mr-2">•</span>
                    <span className="text-gray-700">{subItem}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    // If searching, show search results
    if (searchTerm !== '') {
      return renderSearchResults();
    }

    // Show content based on selected category
    const getContentForCategory = (category) => {
      switch (category) {
        case 'General':
          return generalRules.map((rule, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-semibold text-primary-700 mb-3 flex items-center">
                <span className="bg-primary-100 text-primary-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  {index + 1}
                </span>
                {rule.title}
              </h3>
              <p className="text-gray-700 leading-relaxed">{rule.content}</p>
              {rule.subItems && (
                <ul className="mt-4 space-y-2">
                  {rule.subItems.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-primary-500 mr-2">•</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ));
        
        case 'Performance':
          return performanceGuidelines.map((guideline, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-start">
                <span className="bg-green-100 text-green-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">
                  {index + 1}
                </span>
                <p className="text-gray-700 leading-relaxed">{guideline}</p>
              </div>
            </div>
          ));
        
        case 'Evaluation':
          return scoringCriteria.map((criterion, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center">
                <span className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">
                  {index + 1}
                </span>
                <h3 className="text-lg font-semibold text-gray-800">{criterion}</h3>
              </div>
            </div>
          ));
        
        case 'Penalties':
          return disqualificationGrounds.map((ground, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-red-100">
              <div className="flex items-start">
                <span className="bg-red-100 text-red-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">
                  {index + 1}
                </span>
                <p className="text-gray-700 leading-relaxed">{ground}</p>
              </div>
            </div>
          ));
        
        case 'Sports':
          return sportsRules.map((rule, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-start">
                <span className="bg-orange-100 text-orange-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">
                  {index + 1}
                </span>
                <p className="text-gray-700 leading-relaxed">{rule}</p>
              </div>
            </div>
          ));
        
        default:
          return null;
      }
    };

    if (selectedCategory === 'All') {
      // Show all content organized by category
      return (
        <div className="space-y-8">
          {categories.filter(cat => cat.key !== 'All').map(category => (
            <div key={category.key}>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="bg-primary-100 text-primary-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  {sections.find(s => s.category === category.key)?.icon || '📋'}
                </span>
                {category.label}
              </h3>
              <div className="space-y-4">
                {getContentForCategory(category.key)}
              </div>
            </div>
          ))}
        </div>
      );
    } else {
      // Show content for selected category
      return (
        <div className="space-y-4">
          {getContentForCategory(selectedCategory)}
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Rules & Regulations
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive guidelines and regulations for Gardenia 2025 participants
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search rules, guidelines, criteria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors appearance-none bg-white"
              >
                {categories.map((category) => (
                  <option key={category.key} value={category.key}>
                    {category.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {searchTerm !== '' 
                ? `Search Results for "${searchTerm}"`
                : selectedCategory === 'All' 
                  ? 'All Rules & Regulations'
                  : `${selectedCategory} Rules & Guidelines`
              }
            </h2>
            <div className="w-20 h-1 bg-primary-600 rounded-full"></div>
            {searchTerm !== '' && (
              <p className="text-gray-600 mt-2">
                Found {filteredContent.length} result{filteredContent.length !== 1 ? 's' : ''} across all sections
              </p>
            )}
          </div>
          
          {renderContent()}
        </div>

        {/* Point of Contact - Sports Department */}
        <div className="mt-12 bg-gradient-to-r from-green-600 to-green-800 rounded-xl p-8 text-white">
          <div className="flex items-start">
            <div className="bg-white/20 rounded-full p-3 mr-4 flex-shrink-0">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-4">Point of Contact - Sports Department</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Dr Shinde</h4>
                  <p className="text-white/90">8618690169</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Faroq Siddiqi</h4>
                  <p className="text-white/90">9964159772</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">M Karthikeyan</h4>
                  <p className="text-white/90">8951510374</p>
                </div>
              </div>
              <p className="text-white/90 mt-4 text-sm">
                For sports-related queries, registration, and clarifications, please contact the Sports Department.
              </p>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="mt-8 bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl p-8 text-white">
          <div className="flex items-start">
            <div className="bg-white/20 rounded-full p-3 mr-4 flex-shrink-0">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Important Notice</h3>
              <p className="text-white/90 leading-relaxed">
                All participants are required to read and understand these rules and regulations before participating in any event. 
                Violation of any rule may result in disqualification. For any clarifications, please contact the event coordinators.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RulesAndRegulations;
