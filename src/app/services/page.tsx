import { services } from "@/data/profile";

export default function ServicesPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Services</h1>
        <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">Professional development services tailored to your needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-[var(--card-bg)] border border-[var(--border)] rounded-lg p-6 hover:shadow-lg hover:shadow-[var(--accent-primary)]/10 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{service.icon}</span>
              <h3 className="text-xl font-semibold text-foreground">{service.title}</h3>
            </div>
            <p className="text-[var(--text-secondary)] mb-4">{service.description}</p>
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-foreground mb-2">Technologies:</h4>
              <div className="flex flex-wrap gap-1">
                {service.technologies.map((tech, index) => (
                  <span key={index} className="px-2 py-1 bg-[var(--accent-muted)] text-[var(--text-secondary)] text-xs rounded">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">Key Features:</h4>
              <ul className="text-sm text-[var(--text-secondary)] space-y-1">
                {service.features.map((feature, index) => (
                  <li key={index}>• {feature}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
