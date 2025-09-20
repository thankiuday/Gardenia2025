import { useState } from 'react';

const RulesAndRegulations = () => {
  const [activeSection, setActiveSection] = useState('general');

  const sections = [
    { id: 'general', label: 'General Rules', icon: '📋' },
    { id: 'performance', label: 'Performance Guidelines', icon: '🎭' },
    { id: 'scoring', label: 'Scoring Criteria', icon: '⭐' },
    { id: 'disqualification', label: 'Disqualification', icon: '⚠️' },
    { id: 'sports', label: 'Sports Rules', icon: '🏆' }
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

  const renderContent = () => {
    switch (activeSection) {
      case 'general':
        return (
          <div className="space-y-6">
            {generalRules.map((rule, index) => (
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
            ))}
          </div>
        );
      
      case 'performance':
        return (
          <div className="space-y-4">
            {performanceGuidelines.map((guideline, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-start">
                  <span className="bg-green-100 text-green-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">
                    {index + 1}
                  </span>
                  <p className="text-gray-700 leading-relaxed">{guideline}</p>
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'scoring':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {scoringCriteria.map((criterion, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center">
                  <span className="bg-yellow-100 text-yellow-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">
                    {index + 1}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-800">{criterion}</h3>
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'disqualification':
        return (
          <div className="space-y-4">
            {disqualificationGrounds.map((ground, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-red-100">
                <div className="flex items-start">
                  <span className="bg-red-100 text-red-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">
                    {index + 1}
                  </span>
                  <p className="text-gray-700 leading-relaxed">{ground}</p>
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'sports':
        return (
          <div className="space-y-4">
            {sportsRules.map((rule, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-start">
                  <span className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">
                    {index + 1}
                  </span>
                  <p className="text-gray-700 leading-relaxed">{rule}</p>
                </div>
              </div>
            ))}
          </div>
        );
      
      default:
        return null;
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

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg p-2 mb-8">
          <div className="flex flex-wrap gap-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeSection === section.id
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">{section.icon}</span>
                {section.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {sections.find(s => s.id === activeSection)?.label}
            </h2>
            <div className="w-20 h-1 bg-primary-600 rounded-full"></div>
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
