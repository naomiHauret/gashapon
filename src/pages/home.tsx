import { Title } from "solid-meta";

export default function Page() {
  return (
    <>
    <Title>Gashapon - a fair game marketplace for creators and players</Title>

    <main class='text-center pt-10 sm:pt-0'>
      <div class="w-full px-3 max-w-screen-md mx-auto">
        <h1>
          <span class='sr-only'>Gashapon - a fair, decentralized game marketplace for independant creators and players</span>
          <span class='font-bold font-display text-lg tracking-wide font-variation-width-125'>Create! Support! Play!</span>
        </h1>

      <img  class="mx-auto mt-1.5 mb-4" src="/logo@300vw.png" 
        sizes="(max-width: 479px) 300px, (max-width: 660px) 512px, (max-width: 1199px) 768px, (max-width: 1398px) 1000px, (min-width: 1399px) 1200px"
        srcset="/logo@512vw.png 660w, /logo@768vw.png 992w, /logo@1000vw.png 1200w, /logo@1200vw.png 1399w" 
      alt="" />
        <section>
          <p class='font-mono italic leading-tight text-slate-500 text-xl'>
          <span class='sr-only'>Gashapon is</span> A decentralized marketplace and community for gamers and independant creaters that want to own their games.
          </p>
        </section>
      </div>
    </main>
    </>
  );
}
