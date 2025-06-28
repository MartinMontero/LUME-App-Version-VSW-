import React from 'react';
import { BrightnessCard } from './BrightnessCard';

export const ProjectShowcase: React.FC = () => {
  const sampleProjects = [
    {
      id: '1',
      title: 'EcoTrack Carbon App',
      description: 'Revolutionary app helping individuals track and reduce their carbon footprint with AI-powered recommendations.',
      brightness: 85,
      category: 'Climate Tech',
      collaborators: [
        { id: '1', name: 'Sarah Chen', initials: 'SC', color: 'var(--lume-glow)' },
        { id: '2', name: 'Marcus Rodriguez', initials: 'MR', color: 'var(--lume-warm)' },
        { id: '3', name: 'Lisa Zhang', initials: 'LZ', color: 'var(--lume-soft)' },
        { id: '4', name: 'David Kim', initials: 'DK', color: 'var(--lume-spark)' }
      ]
    },
    {
      id: '2',
      title: 'MedConnect Platform',
      description: 'Connecting rural patients with specialists through secure video consultations and AI diagnostics.',
      brightness: 72,
      category: 'HealthTech',
      collaborators: [
        { id: '5', name: 'Dr. James Liu', initials: 'JL', color: 'var(--lume-glow)' },
        { id: '6', name: 'Maya Patel', initials: 'MP', color: 'var(--lume-warm)' },
        { id: '7', name: 'Alex Foster', initials: 'AF', color: 'var(--lume-soft)' }
      ]
    },
    {
      id: '3',
      title: 'FoodShare Network',
      description: 'Platform connecting restaurants with excess food to local food banks and shelters.',
      brightness: 68,
      category: 'Social Impact',
      collaborators: [
        { id: '8', name: 'Emma Wilson', initials: 'EW', color: 'var(--lume-glow)' },
        { id: '9', name: 'Tom Mitchell', initials: 'TM', color: 'var(--lume-warm)' },
        { id: '10', name: 'Rachel Green', initials: 'RG', color: 'var(--lume-soft)' },
        { id: '11', name: 'Kevin Park', initials: 'KP', color: 'var(--lume-spark)' },
        { id: '12', name: 'Maria Santos', initials: 'MS', color: 'var(--lume-mist)' },
        { id: '13', name: 'John Doe', initials: 'JD', color: 'var(--lume-glow)' }
      ]
    },
    {
      id: '4',
      title: 'FinFlow Analytics',
      description: 'Real-time financial analytics dashboard for small businesses with predictive insights.',
      brightness: 91,
      category: 'FinTech',
      collaborators: [
        { id: '14', name: 'Jennifer Kim', initials: 'JK', color: 'var(--lume-glow)' },
        { id: '15', name: 'David Thompson', initials: 'DT', color: 'var(--lume-warm)' }
      ]
    },
    {
      id: '5',
      title: 'VR Learning Hub',
      description: 'Immersive virtual reality platform for remote education and skill development.',
      brightness: 56,
      category: 'EdTech',
      collaborators: [
        { id: '16', name: 'Sophie Chen', initials: 'SC', color: 'var(--lume-glow)' },
        { id: '17', name: 'Mike Davis', initials: 'MD', color: 'var(--lume-warm)' },
        { id: '18', name: 'Anna Lee', initials: 'AL', color: 'var(--lume-soft)' }
      ]
    },
    {
      id: '6',
      title: 'Smart City IoT',
      description: 'IoT sensor network for optimizing urban infrastructure and reducing energy consumption.',
      brightness: 79,
      category: 'Smart Cities',
      collaborators: [
        { id: '19', name: 'Robert Johnson', initials: 'RJ', color: 'var(--lume-glow)' },
        { id: '20', name: 'Lisa Wang', initials: 'LW', color: 'var(--lume-warm)' },
        { id: '21', name: 'Carlos Rodriguez', initials: 'CR', color: 'var(--lume-soft)' },
        { id: '22', name: 'Nina Patel', initials: 'NP', color: 'var(--lume-spark)' }
      ]
    }
  ];

  return (
    <section className="py-24 px-6 bg-pattern">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-slide-up">
          <div className="inline-flex items-center px-4 py-2 bg-lume-warm/20 backdrop-blur-sm rounded-full text-lume-warm text-sm font-medium mb-6 border border-lume-warm/20">
            ✨ Project Showcase
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            Brilliant Projects
            <span className="block gradient-text">Illuminating the Future</span>
          </h2>
          <p className="text-xl text-lume-light max-w-3xl mx-auto leading-relaxed opacity-90">
            Discover the brightest innovations from Vancouver's startup ecosystem. 
            Each project radiates with unique brilliance and collaborative energy.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleProjects.map((project, index) => (
            <div
              key={project.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <BrightnessCard
                title={project.title}
                description={project.description}
                brightness={project.brightness}
                collaborators={project.collaborators}
                category={project.category}
              />
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <div className="card-elevated p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-display font-semibold text-white mb-4">
              Ready to Add Your Brilliance?
            </h3>
            <p className="text-lume-light mb-6 opacity-80">
              Join the constellation of innovative projects shaping Vancouver's startup landscape.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary">
                Submit Your Project
              </button>
              <button className="btn-secondary">
                Explore More Projects
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};