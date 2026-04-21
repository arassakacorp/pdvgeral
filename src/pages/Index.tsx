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
            className="w-full h-full object-cover opacity-40 scale-110 blur-sm"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        </div>

        <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
              <Star className="h-4 w-4 text-primary fill-primary" />
              <span className="text-xs font-black uppercase tracking-widest">O Melhor da Região</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black italic uppercase leading-[0.9] tracking-tighter">
              Sabor <br />
              <span className="text-primary">Artesanal</span> <br />
              Elevado
            </h1>
            <p className="text-lg text-white/60 max-w-md leading-relaxed">
              Hambúrgueres feitos na brasa, com blends secretos e a nossa exclusiva Banana Caramelizada que vai explodir sua mente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/cardapio">
                <Button size="lg" className="h-16 px-10 rounded-2xl text-xl font-black uppercase tracking-tighter group">
                  Ver Cardápio <ArrowRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <div className="flex items-center gap-4 px-6 border-l border-white/20">
                <div className="text-primary">
                  <Clock className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Aberto Hoje até</p>
                  <p className="font-black text-xl italic tracking-tighter">23:30h</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative group perspective-1000 hidden md:block">
            <div className="relative z-10 transition-transform duration-500 group-hover:rotate-3 group-hover:scale-105">
               <img 
                src="/nano_banana_burger_special_1776776797511.png" 
                alt="Signature Burger" 
                className="rounded-[3rem] shadow-glow-lg border-4 border-primary/20"
              />
              <div className="absolute -bottom-6 -right-6 bg-primary text-black p-6 rounded-3xl shadow-glow rotate-12 group-hover:rotate-0 transition-all">
                 <p className="font-black text-3xl italic leading-none uppercase">R$ 38,90</p>
                 <p className="text-[10px] font-bold uppercase tracking-widest">Nano Especial</p>
              </div>
            </div>
            <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full -z-10 animate-pulse" />
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
