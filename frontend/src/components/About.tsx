// components/About.tsx
"use client";

import React, { useEffect, useState } from "react";

// (Keep all your existing type definitions here: Personal, Education, Experience, Project, Skill, Certificate)
type Personal = {
  id?: string;
  name: string;
  passion?: string;
  address?: string;
  phone?: string;
  email: string;
  linkedin?: string;
  github?: string;
  birthdate?: string;
};

type Education = {
  id?: string;
  school: string;
  degree: string;
  institution?: string;
  field?: string;
  start_date?: string;
  end_date?: string;
  description?: string;
};

type Experience = {
  id?: string;
  Company_name: string;
  position: string;
  start_date?: string;
  end_date?: string;
  description?: string;
};

type Project = {
  id?: string;
  name: string;
  description?: string;
  technologies?: string;
  repository_url?: string;
};

type Skill = {
  id?: string;
  name: string;
  image_filename: string;
  content_type?: string;
  image_data?: string; // Base64 encoded image
};

type Certificate = {
  id?: string;
  title: string;
  issuer?: string;
  issue_date?: string;
  expiration_date?: string;
  credential_url?: string;
};


export default function About() {
  const [personal, setPersonal] = useState<Personal | null>(null);
  const [educations, setEducations] = useState<Education[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const personalRes = await fetch("http://localhost:8000/personals/get");
        if (!personalRes.ok) throw new Error("Failed to fetch personal info");
        const personalData = await personalRes.json();
        setPersonal(personalData.length > 0 ? personalData[0] : null);

        const educationRes = await fetch("http://localhost:8000/educations/get");
        if (!educationRes.ok) throw new Error("Failed to fetch education info");
        const educationData = await educationRes.json();
        setEducations(educationData);

        const experienceRes = await fetch("http://localhost:8000/experiences/get");
        if (!experienceRes.ok) throw new Error("Failed to fetch experience info");
        const experienceData = await experienceRes.json();
        
        const sortedExperiences = experienceData.sort((a: Experience, b: Experience) => {
          const dateA = a.start_date ? new Date(a.start_date).getTime() : 0;
          const dateB = b.start_date ? new Date(b.start_date).getTime() : 0;
          if (isNaN(dateA) && isNaN(dateB)) return 0;
          if (isNaN(dateA)) return 1;
          if (isNaN(dateB)) return -1;
          return dateB - dateA;
        });
        setExperiences(sortedExperiences);

        const projectsRes = await fetch("http://localhost:8000/projects/get");
        if (!projectsRes.ok) throw new Error("Failed to fetch projects info");
        const projectsData = await projectsRes.json();
        setProjects(projectsData);

        const skillsRes = await fetch("http://localhost:8000/skills/get");
        if (!skillsRes.ok) throw new Error("Failed to fetch skills info");
        const skillsData = await skillsRes.json();
        setSkills(skillsData);

        const certificatesRes = await fetch("http://localhost:8000/certificates/get");
        if (!certificatesRes.ok) throw new Error("Failed to fetch certificates info");
        const certificatesData = await certificatesRes.json();
        setCertificates(certificatesData);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      // Changed background here for consistency - remove bg-black if you want transparent during loading
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundImage: 'url(/Desk.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      // Changed background here for consistency - remove bg-black if you want transparent during error
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundImage: 'url(/Desk.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-6 text-red-200">
          Error: {error}
        </div>
      </div>
    );
  }

  if (!personal) {
    return (
      // Changed background here for consistency - remove bg-black if you want transparent during no data
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundImage: 'url(/Desk.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        <div className="text-slate-400 text-lg">No personal information found</div>
      </div>
    );
  }

  const formatDateForExperience = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (dateString === 'Present' || date.getTime() > new Date('2025-07-28').getTime()) {
        return 'Present';
    }
    return date.toLocaleString('en-US', { year: 'numeric', month: 'long' });
  };


  return (
    // PRIMARY CHANGE: Apply background image directly to the main container, remove other background styles
    <div
      className="min-h-screen text-white relative overflow-hidden"
      style={{
        backgroundImage: 'url(/Desk.png)', // Using Desk.png as per your screenshot and previous message's code
        backgroundSize: 'cover',
        backgroundPosition: 'top center',
        backgroundRepeat: 'no-repeat',
        // Removed backgroundColor and backgroundBlendMode to keep only the image
      }}
    >
      {/* Background decorative elements - REMOVED or commented out to keep only the background image */}
      {/*
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>
      */}

      {/* The rest of your component content remains the same */}
      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center px-4 pt-2 pb-1">
        <div className="flex items-center space-x-8">
          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8 text-slate-300 px-10">
            <a href="#" className="hover:text-white transition-colors">About me</a>
            <a href="#" className="hover:text-white transition-colors">Experience</a>
            <a href="#" className="hover:text-white transition-colors">Projects</a>
            <a href="#" className="hover:text-white transition-colors">Skills</a>
            <a href="#" className="hover:text-white transition-colors">Certificates</a>
            <a href="#" className="hover:text-white transition-colors">Contact me</a>
          </div>
        </div>

        {/* Social Media Icons & Contact Info */}
        <div className="flex flex-col items-end space-y-2">
          <div className="flex space-x-3">
            {personal.github && (
              <a
                href={personal.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-700/50 rounded-full flex items-center justify-center hover:bg-slate-600/50 transition-colors"
              >
                <svg className="w-5 h-5 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            )}
            
            {personal.linkedin && (
              <a
                href={personal.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-700/50 rounded-full flex items-center justify-center hover:bg-slate-600/50 transition-colors"
              >
                <svg className="w-5 h-5 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            )}
            
            {personal.email && (
              <a
                href={`mailto:${personal.email}`}
                className="w-10 h-10 bg-slate-700/50 rounded-full flex items-center justify-center hover:bg-slate-600/50 transition-colors"
              >
                <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            )}
          </div>
          
          {/* Contact Info */}
          <div className="text-right text-sm text-slate-400">
            {personal.address && (
              <div className="whitespace-pre-line">{personal.address}</div>
            )}
            {personal.phone && (
              <div className="mt-1">{personal.phone}</div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-between px-6 py-20">
        {/* Left Side - Content */}
        <div className="flex-1 max-w-2xl">
          {/* Large Name */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-4 leading-tight px-20">
            {personal.name}
          </h1>
          
          {/* Passion/Role */}
          {personal.passion && (
            <h2 className="text-2xl md:text-3xl lg:text-4xl text-slate-300 mb-8 font-light px-20">
              {personal.passion}
            </h2>
          )}
          
          {/* Welcome Message */}
          <p className="text-xl text-slate-400 mb-8 px-20">
            Welcome to my portfolio
          </p>
          <div className="flex items-center space-x-4 px-20">
            <button className="bg-slate-700/50 hover:bg-slate-600/50 text-white px-8 py-3 rounded-full transition-all duration-300 border border-slate-600/50">
              Contact Me
            </button>
          </div>

          {/* Education Cards */}
          <div className="mt-12 space-y-4 max-w-sm px-20">
            {educations.map((education, index) => (
              <div 
                key={education.id || index} 
                className="group bg-slate-800/30 backdrop-blur rounded-2xl px-6 py-4 border border-slate-700/50 hover:bg-slate-700/40 hover:border-slate-600/50 transition-all duration-300 cursor-pointer relative overflow-hidden"
              >
                {/* Default visible content */}
                <div className="text-sm text-slate-400 mb-1">{education.degree}</div>
                <div className="text-white font-medium">{education.school}</div>
                {education.institution && (
                  <div className="text-sm text-slate-300 mt-1">{education.institution}</div>
                )}
                
                {/* Expanded content on hover */}
                <div className="max-h-0 group-hover:max-h-40 overflow-hidden transition-all duration-300 ease-in-out">
                  <div className="pt-3 border-t border-slate-600/30 mt-3">
                    {education.field && (
                      <div className="text-sm text-slate-300 mb-2">
                        <span className="text-slate-500">Field:</span> {education.field}
                      </div>
                    )}
                    {(education.start_date || education.end_date) && (
                      <div className="text-xs text-slate-400 mb-2">
                        <span className="text-slate-500">Duration:</span> 
                        {education.start_date && ` ${new Date(education.start_date).getFullYear()}`}
                        {education.start_date && education.end_date && " - "}
                        {education.end_date && new Date(education.end_date).getFullYear()}
                      </div>
                    )}
                    {education.description && (
                      <div className="text-xs text-slate-300 mt-2">
                        <span className="text-slate-500">Description:</span> {education.description}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Hover indicator */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Image Placeholder */}
        <div className="hidden lg:flex items-center justify-center flex-1">
          <div className="relative">
            {/* Background Shape - REMOVED or commented out */}
            {/*
            <div className="absolute inset-0 w-96 h-96 bg-purple-500/10 rounded-full blur-2xl"></div>
            */}
            
            {/* Profile Image Placeholder */}
            <div className="relative w-80 h-80 bg-slate-700/50 rounded-full border-4 border-slate-600/50 flex items-center justify-center">
              <div className="text-slate-400 text-center">
                <svg className="w-20 h-20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <p className="text-sm">Profile Image</p>
              </div>
            </div>

            {/* Floating Stats Card */}
            <div className="absolute -bottom-8 -right-8 bg-slate-800/80 backdrop-blur rounded-2xl p-6 border border-slate-700/50">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">10+</div>
                <div className="text-sm text-slate-400">Completed Projects</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* My Experience Section */}
      <div className="relative z-10 py-20 px-6">
        <h2 className="text-5xl font-bold text-center text-white mb-16">My Experience</h2>
        <div className="flex flex-wrap justify-center items-stretch gap-x-8 gap-y-12">
          {experiences.map((exp, index) => (
            <React.Fragment key={exp.id || index}>
              <div 
                className="group bg-slate-800/30 backdrop-blur rounded-2xl px-6 py-4 border border-slate-700/50 hover:bg-slate-700/40 hover:border-slate-600/50 transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col items-center max-w-xs text-center"
                style={{ minWidth: '250px' }}
              >
                {/* Default visible content */}
                <div className="text-xl md:text-2xl font-semibold text-white mb-1">
                  {exp.Company_name}
                </div>
                {exp.position && (
                  <div className="text-lg text-slate-300 mb-1">
                      {exp.position}
                  </div>
                )}
                <div className="text-slate-400 text-sm mb-4">
                  ({formatDateForExperience(exp.start_date)} - {exp.end_date ? formatDateForExperience(exp.end_date) : 'Present'})
                </div>
                
                {/* Expanded content on hover for description */}
                <div className="max-h-0 group-hover:max-h-40 overflow-hidden transition-all duration-300 ease-in-out">
                  {exp.description && (
                    <div className="pt-3 border-t border-slate-600/30 mt-3 text-slate-300 text-sm italic">
                      <span className="text-slate-500 not-italic">Description: </span> {exp.description}
                    </div>
                  )}
                </div>

                {/* Hover indicator (down arrow) */}
                {exp.description && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                )}
              </div>
              {/* Timeline dot and connecting line between items */}
              {index < experiences.length - 1 && (
                <div className="flex items-center flex-shrink-0">
                  <div className="w-3 h-3 bg-white rounded-full border border-slate-500"></div>
                  <div className="h-0.5 bg-slate-600 w-20 md:w-40"></div>
                  <div className="w-3 h-3 bg-white rounded-full border border-slate-500"></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Projects Section */}
      <div className="relative z-10 py-20 px-6">
        <h2 className="text-5xl font-bold text-center text-white mb-16">Projects</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {projects.map((project, index) => (
            <a 
              key={project.id || index} 
              href={project.repository_url || '#'} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group bg-slate-800/30 backdrop-blur rounded-2xl p-6 border border-slate-700/50 hover:bg-slate-700/40 hover:border-slate-600/50 transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between"
              style={{ flex: '1 1 calc(50% - 1rem)', maxWidth: '400px', minHeight: '200px' }} 
            >
              <div>
                <h3 className="text-2xl font-semibold text-white mb-2">{project.name}</h3>
                {project.description && (
                  <div className="overflow-hidden transition-all duration-300 ease-in-out">
                    <p className="text-slate-300 text-sm mb-4">
                      {project.description}
                    </p>
                  </div>
                )}
              </div>
              
              {project.technologies && (
                <p className="text-slate-400 text-xs pt-3 border-t border-slate-600/30 mt-auto">
                  <span className="text-slate-500">Tech Stacks:</span> {project.technologies}
                </p>
              )}
            </a>
          ))}
        </div>
      </div>

      {/* Skills and Certificates Section - Two Column Layout */}
      <div className="relative z-10 py-20 px-6">
        <div className="flex flex-col md:flex-row justify-center gap-12"> {/* Container for two columns */}
          
          {/* Skills Section (Left Column) */}
          <div className="w-full md:w-1/2 flex flex-col items-center">
            <h2 className="text-5xl font-bold text-white mb-12">My Skills</h2>
            <div className="flex flex-wrap justify-center gap-6 max-w-2xl">
              {skills.map((skill, index) => (
                <div 
                  key={skill.id || index} 
                  className="bg-slate-800/30 backdrop-blur rounded-2xl p-4 border border-slate-700/50 hover:bg-slate-700/40 hover:border-slate-600/50 transition-all duration-300 cursor-pointer text-center flex flex-col items-center"
                  style={{ minWidth: '120px', maxWidth: '150px' }}
                >
                  {skill.image_data && skill.content_type && (
                    // Displaying the image from base64 data
                    <img 
                      src={`data:${skill.content_type};base64,${skill.image_data}`} 
                      alt={skill.name} 
                      className="w-16 h-16 object-contain mb-2" // Adjust size as needed
                    />
                  )}
                  <h3 className="text-lg font-semibold text-white">{skill.name}</h3>
                </div>
              ))}
            </div>
          </div>

          {/* Certificates Section (Right Column) - All in one card */}
          <div className="w-full md:w-1/2 flex flex-col items-center">
            <h2 className="text-5xl font-bold text-white mb-12">Certificates</h2>
            <div 
              className="bg-slate-800/30 backdrop-blur rounded-2xl p-6 border border-slate-700/50 max-w-2xl w-full"
              style={{ maxHeight: '600px', overflowY: 'auto' }} // Added max-height and overflow for scrollability
            >
              {certificates.length === 0 && (
                <p className="text-slate-400 text-center">No certificates found.</p>
              )}
              {certificates.map((certificate, index) => (
                <div key={certificate.id || index} className="mb-6 pb-6 last:mb-0 last:pb-0 border-b last:border-b-0 border-slate-700/50">
                  <h3 className="text-xl font-semibold text-white mb-1">{certificate.title}</h3>
                  {certificate.issuer && (
                    <p className="text-slate-300 text-sm">{certificate.issuer}</p>
                  )}
                  {(certificate.issue_date || certificate.expiration_date) && (
                    <p className="text-slate-400 text-xs mt-1">
                      Issued: {certificate.issue_date || 'N/A'} 
                      {certificate.expiration_date && ` | Expires: ${certificate.expiration_date}`}
                    </p>
                  )}
                  {certificate.credential_url && (
                    <a 
                      href={certificate.credential_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 text-sm mt-2 inline-block hover:underline"
                    >
                      View Credential
                      <svg className="inline-block w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}