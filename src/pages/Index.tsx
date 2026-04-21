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
              <span className="text-black font-black text-2xl rotate-3">R</span>
            </div>
            <span className="font-black text-2xl tracking-tighter uppercase italic">
              Red <span className="text-primary">Burguer's</span>
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
              Red <br />
              <span className="text-primary stroke-text">Burguer's</span>
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

      {/* Menu Highlights Section */}
      <section id="menu" className="py-24 bg-black relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">
              Nossos <span className="text-primary">Destaques</span>
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">
              Os campeões de vendas. Escolha o seu favorito e prepare-se para uma explosão de sabor.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Item 1 */}
            <div className="group bg-white/[0.02] border border-white/5 rounded-3xl p-6 hover:border-primary/50 transition-all hover:-translate-y-2">
              <div className="aspect-square bg-white/5 rounded-2xl mb-6 overflow-hidden relative">
                 <img src="/premium_burger_hero_1776746871020.png" alt="Burger 1" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                 <div className="absolute top-4 right-4 bg-primary text-black font-black text-sm px-3 py-1 rounded-full rotate-3">
                   TOP 1
                 </div>
              </div>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2">Supremo <span className="text-primary">Bacon</span></h3>
              <p className="text-white/40 text-sm mb-6 line-clamp-2">
                Pão brioche artesanal, blend 200g, muito queijo cheddar, bacon crocante e nossa maionese secreta.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-white">R$ 42</span>
                <Link to="/cardapio"><Button size="sm" className="rounded-full font-bold uppercase shadow-glow text-black">Pedir</Button></Link>
              </div>
            </div>
            
            {/* Item 2 */}
            <div className="group bg-white/[0.02] border border-white/5 rounded-3xl p-6 hover:border-primary/50 transition-all hover:-translate-y-2 relative">
              <div className="absolute -inset-1 bg-gradient-to-b from-primary/50 to-transparent rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
              <div className="aspect-square bg-white/5 rounded-2xl mb-6 overflow-hidden relative">
                 <img src="/nano_banana_burger_special_1776776797511.png" alt="Burger 2" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2">Red <span className="text-primary">Especial</span></h3>
              <p className="text-white/40 text-sm mb-6 line-clamp-2">
                Nossa assinatura! Blend bovino, banana caramelizada na chapa, gorgonzola e rúcula fresca.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-white">R$ 38</span>
                <Link to="/cardapio"><Button size="sm" className="rounded-full font-bold uppercase shadow-glow text-black">Pedir</Button></Link>
              </div>
            </div>

            {/* Item 3 */}
            <div className="group bg-white/[0.02] border border-white/5 rounded-3xl p-6 hover:border-primary/50 transition-all hover:-translate-y-2">
              <div className="aspect-square bg-white/5 rounded-2xl mb-6 flex items-center justify-center overflow-hidden">
                 <img src="/premium_burger_hero_1776746871020.png" alt="Burger 3" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 hue-rotate-15" />
              </div>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2">Smash <span className="text-primary">Duplo</span></h3>
              <p className="text-white/40 text-sm mb-6 line-clamp-2">
                Pão de batata super macio, dois smash burgers de 90g com crostinha perfeita e dobro de queijo prato.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-white">R$ 32</span>
                <Link to="/cardapio"><Button size="sm" className="rounded-full font-bold uppercase shadow-glow text-black">Pedir</Button></Link>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link to="/cardapio">
              <Button variant="outline" className="rounded-full px-8 border-primary/50 text-primary hover:bg-primary/10 font-bold uppercase bg-transparent">
                Ver Cardápio Completo <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Sobre Section */}
      <section id="sobre" className="py-24 bg-zinc-950 border-t border-white/5 relative overflow-hidden">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div className="relative">
             <div className="aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 relative z-10">
               <img src="/premium_burger_hero_1776746871020.png" alt="Nossa Cozinha" className="w-full h-full object-cover scale-150 -translate-x-10 opacity-60 grayscale hover:grayscale-0 transition-all duration-1000" />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
             </div>
             <div className="absolute -bottom-8 -right-8 bg-primary text-black p-8 rounded-3xl z-20 shadow-glow font-black text-2xl max-w-[200px] rotate-3">
               DESDE 2024 FAZENDO HISTÓRIA
             </div>
          </div>
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-sm">
              <span className="h-px w-8 bg-primary" /> Nossa História
            </div>
            <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-tight">
              Não fazemos lanches.<br />Fazemos <span className="text-primary">Arte.</span>
            </h2>
            <p className="text-white/60 leading-relaxed text-lg">
              A RedBurguer's nasceu da inconformidade com os hambúrgueres sem graça da cidade. Nós queríamos algo que fosse bruto no tamanho, mas sofisticado no sabor.
            </p>
            <p className="text-white/60 leading-relaxed text-lg">
              Foi misturando a suculência da carne Angus com a doçura inesperada da nossa receita especial de banana que criamos uma nova categoria de hambúrgueres em Asgard. Hoje, não entregamos apenas comida, entregamos uma experiência.
            </p>
            <div className="pt-6 grid grid-cols-2 gap-8">
               <div>
                 <h4 className="text-4xl font-black text-white mb-2">5k+</h4>
                 <p className="text-white/40 text-sm font-bold uppercase tracking-widest">Clientes Felizes</p>
               </div>
               <div>
                 <h4 className="text-4xl font-black text-white mb-2">100%</h4>
                 <p className="text-white/40 text-sm font-bold uppercase tracking-widest">Artesanal</p>
               </div>
            </div>
          </div>
        </div>
      </section>
      <footer className="py-20 bg-black border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-black font-black text-xl italic leading-none">R</span>
                </div>
                <span className="font-black text-2xl tracking-tighter uppercase italic">
                  Red <span className="text-primary">Burguer's</span>
                </span>
              </div>
              <p className="text-white/40 max-w-sm leading-relaxed">
                Mais do que uma hamburgueria, uma experiência gastronômica feita para quem não se contenta com o básico.
              </p>
              <div className="flex gap-4">
                <a href="https://instagram.com" target="_blank" rel="noreferrer">
                  <Button variant="ghost" size="icon" className="rounded-xl border border-white/10 hover:bg-white/5">
                    <Instagram className="h-5 w-5" />
                  </Button>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer">
                  <Button variant="ghost" size="icon" className="rounded-xl border border-white/10 hover:bg-white/5">
                    <Facebook className="h-5 w-5" />
                  </Button>
                </a>
                <a href="https://wa.me/5533998797876" target="_blank" rel="noreferrer">
                  <Button variant="ghost" size="icon" className="rounded-xl border border-white/10 hover:bg-white/5">
                    <Phone className="h-5 w-5" />
                  </Button>
                </a>
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
            © 2026 RedBurguer's. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
