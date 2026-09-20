import { Link } from 'react-router-dom';
import { Github, ExternalLink } from 'lucide-react';
import { Logo } from './Logo';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Platform',
      links: [
        { label: 'Home', path: '/' },
        { label: 'Verify', path: '/verify' },
        { label: 'Integrity Check', path: '/integrity-check' },
        { label: 'Admin', path: '/admin' },
      ]
    }
  ];

  return (
    <footer className="border-t border-white/5 bg-background/50 backdrop-blur-xl mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity w-fit">
              <Logo size="md" className="text-white" />
              <span className="text-2xl font-bold text-white tracking-tight">
                Tracely
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
              Securing global supply chains with decentralized trust. 
              Immutable provenance powered by AI Vision and Ethereum.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="https://github.com/Lakshay-Deol/Tracely" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-all transform hover:scale-110"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          {footerLinks.map((section) => (
            <div key={section.title} className="space-y-4">
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link 
                      to={link.path} 
                      className="text-sm text-muted-foreground hover:text-white transition-colors flex items-center gap-1 group"
                    >
                      {link.label}
                      {link.path === '#' && <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex justify-center">
          <p className="text-xs text-muted-foreground text-center">
            © {currentYear} Tracely Protocol. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
