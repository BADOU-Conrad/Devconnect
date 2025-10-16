import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Users, Zap } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-accent relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
      
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-white">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in-up">
          {/* Logo */}
          <div className="mx-auto w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-8 shadow-2xl border border-white/20">
            <span className="text-4xl font-bold">DC</span>
          </div>
          
          {/* Hero Text */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Bienvenue sur
            <br />
            <span className="bg-white text-primary px-4 py-2 inline-block mt-2 rounded-xl">
              DevConnect
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Gérez vos projets comme jamais auparavant. Collaborez, organisez et livrez vos projets avec efficacité.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 mb-12">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
              <CheckCircle2 className="h-10 w-10 mb-4 mx-auto" />
              <h3 className="font-semibold text-lg mb-2">Gestion de tâches</h3>
              <p className="text-white/80 text-sm">Organisez vos tâches avec des tableaux Kanban intuitifs</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
              <Users className="h-10 w-10 mb-4 mx-auto" />
              <h3 className="font-semibold text-lg mb-2">Collaboration</h3>
              <p className="text-white/80 text-sm">Travaillez en équipe en temps réel</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
              <Zap className="h-10 w-10 mb-4 mx-auto" />
              <h3 className="font-semibold text-lg mb-2">Performance</h3>
              <p className="text-white/80 text-sm">Suivez la progression de vos projets</p>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link to="/register">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 shadow-2xl text-lg px-8 py-6 h-auto group"
              >
                Commencer gratuitement
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            
            <Link to="/login">
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-6 h-auto bg-transparent"
              >
                Se connecter
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
