import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Clock, 
  MapPin, 
  Instagram, 
  Facebook, 
  Phone, 
  Utensils, 
  Truck, 
  Star,
  ChevronDown
} from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-glow">
              <span className="text-black font-black text-2xl rotate-3">N</span>
            </div>
            <span className="font-black text-2xl tracking-tighter uppercase italic">
              Nano <span className="text-primary">Banana</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-white/70">
            <a href="#home" className="hover:text-primary transition-colors">Início</a>
            <a href="#menu" className="hover:text-primary transition-colors">Cardápio</a>
            <a href="#sobre" className="hover:text-primary transition-colors">Sobre</a>
            <Link to="/auth" className="hover:text-primary transition-colors">Admin</Link>
          </div>
          <Link to="/cardapio">
            <Button className="rounded-full px-8 font-black uppercase tracking-tighter shadow-glow hover:scale-105 transition-all">
              Peça Agora
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="/premium_burger_hero_1776746871020.png" 
            alt="Background" 
            className="w-full h-full object-cover opacity-50 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
        </div>

        <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-10 animate-fade-in">
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-md">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Aberto e Entregando</span>
            </div>
            <h1 className="text-7xl md:text-9xl font-black italic uppercase leading-[0.8] tracking-tighter">
              Nano <br />
              <span className="text-primary stroke-text">Banana</span>
            </h1>
            <p className="text-xl text-white/80 max-w-sm font-medium leading-tight">
              Onde a força do sabor encontra a doçura da perfeição. O hambúrguer que você nunca vai esquecer.
            </p>
            <div className="flex flex-col sm:row gap-6 pt-4">
              <Link to="/cardapio">
                <Button size="lg" className="h-20 px-12 rounded-3xl text-2xl font-black uppercase tracking-tighter shadow-glow hover:scale-105 active:scale-95 transition-all">
                  Peça o Seu Agora
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative hidden md:block group">
             <div className="relative z-10 animate-float">
                <img 
                  src="/nano_banana_burger_special_1776776797511.png" 
                  alt="Special Burger" 
                  className="rounded-[4rem] shadow-glow-lg border-2 border-white/10 group-hover:rotate-2 transition-transform duration-700"
                />
                <div className="absolute -top-10 -right-10 bg-accent text-black p-8 rounded-full shadow-glow font-black text-4xl rotate-12 flex flex-col items-center justify-center border-4 border-black">
                   <span className="text-sm uppercase tracking-widest mb-1">Só</span>
                   R$ 38
                </div>
             </div>
             <div className="absolute -inset-20 bg-primary/20 blur-[120px] rounded-full -z-10 animate-pulse" />
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-white/20" />
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white/[0.02] border-y border-white/5">
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-12 text-center">
          <div className="space-y-4">
            <div className="h-20 w-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto text-primary">
              <Utensils className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-black italic uppercase tracking-tighter">Carne 100% Angus</h3>
            <p className="text-white/40 text-sm leading-relaxed px-4">
              Selecionamos os melhores cortes para garantir suculência e sabor em cada mordida.
            </p>
          </div>
          <div className="space-y-4">
            <div className="h-20 w-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto text-primary">
              <Truck className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-black italic uppercase tracking-tighter">Entrega Ninja</h3>
            <p className="text-white/40 text-sm leading-relaxed px-4">
              Seu hambúrguer chega quentinho e montado, como se tivesse acabado de sair da chapa.
            </p>
          </div>
          <div className="space-y-4">
            <div className="h-20 w-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto text-primary">
              <Star className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-black italic uppercase tracking-tighter">Receita Secreta</h3>
            <p className="text-white/40 text-sm leading-relaxed px-4">
              Nosso molho especial e a banana caramelizada são o que nos torna únicos.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-black border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-black font-black text-xl italic leading-none">N</span>
                </div>
                <span className="font-black text-2xl tracking-tighter uppercase italic">
                  Nano <span className="text-primary">Banana</span>
                </span>
              </div>
              <p className="text-white/40 max-w-sm leading-relaxed">
                Mais do que uma hamburgueria, uma experiência gastronômica feita para quem não se contenta com o básico.
              </p>
              <div className="flex gap-4">
                <Button variant="ghost" size="icon" className="rounded-xl border border-white/10 hover:bg-white/5">
                  <Instagram className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-xl border border-white/10 hover:bg-white/5">
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-xl border border-white/10 hover:bg-white/5">
                  <Phone className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-black uppercase tracking-widest text-xs text-primary">Localização</h4>
              <p className="text-white/60 text-sm flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" /> Rua dos Burgers, 123 - Centro
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-black uppercase tracking-widest text-xs text-primary">Contato</h4>
              <p className="text-white/60 text-sm flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" /> (33) 99879-7876
              </p>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 text-center text-white/20 text-xs font-bold uppercase tracking-widest">
            © 2026 Nano Banana Burger. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
