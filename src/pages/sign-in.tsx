import ButtonGroupWalletOptions from "@components/ButtonGroupWalletOptions";
import { Title } from "solid-meta";

export default function Page() {
  return (
    <>
    <Title>Sign-in with Ethereum - Gashapon</Title>
    <main class="mx-auto max-w-screen-2xs px-3">
    <h1 class="text-3xl font-bold text-white mb-3">Sign-in</h1>
    <p class="text-slate-400 text-md">Use your favourite Ethereum wallet to sign-in to use Gashapon.</p>
    <div class="pt-6 pb-8">
      <ButtonGroupWalletOptions />
    </div>
    <p class="text-slate-500 leading-wider">
      An Ethereum wallet is a tool you are can use to interact with EVM-compatible blockchain. <br /> You can use your wallet to store, send, and receive your on-chain assets, like your NFTs or your tokens.
    </p> 
    </main>
    </>
  );
}
