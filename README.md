# Gashapon: 
## The pitch
*Gaming distributing platforms are broken.*

- Games can be taken off from an e-shop and creators will have no say on this
- Platforms take a % of their sales
- Creators face censorship due to geopolitical tensions, removing playable elements and downgrading the original game experience
- Third parties payment processors can hold custody of creators earnings and take a fee
- Platforms can decide to ban an account forever, with no way to access the games that account  paid for 
- Fan-games face censorship from the big names in the industry, shutting them down despite those being non-profit. 

Gashapon is an alternative digital marketplace, distributing platform and online community for gamers and independant creators. The goal of Gashapon is to help fixing the problem above, help indie game creators make a living, let communities unleash their creativity **at their own pace**, contribute to the *transparent* making of great games and go way beyong just *consuming*.

### Inspiration
Video list that inspirated this project

- [How mods drive innovation in gaming](https://www.youtube.com/watch?v=FOy4Aopuy98/)
- [Sony Is On A Censorship Rampage](https://www.youtube.com/watch?v=6Zmcg6iWFLU)
- [What Happens When Your ACCOUNT Gets BANNED on PS5?](https://www.youtube.com/watch?v=qvnR-ybecHc)
- [Remember owning games? Why you cant buy games anymore | What you must know about Steam, Ubisoft & EA](https://www.youtube.com/watch?v=3O09FapcwjM)
- [Why Nintendo Took Down Fan Made Pokemon Game - Pokemon Uranium](https://www.youtube.com/watch?v=1xlMW8tESuk)
- [Mod Authors quit making mods because of stolen mods on Bethesda.net!!! (RANT)](https://www.youtube.com/watch?v=m48SecK7JsU)
- [The GTA Trilogy is Everything Wrong with Modern Gaming](https://www.youtube.com/watch?v=jrxMD2LTot0)
- [How Stardew Valley Was Made by Only One Person](https://www.youtube.com/watch?v=4-k6j9g5Hzk)
- [How Subnautica Was Made and Saved by its Community](https://www.youtube.com/watch?v=2R9YWticVfw)


---
## Get started
### Pre-requisites
* `node` version `>=18.0.0`
* `npm` version `>=7.20.6`
* Have [Metamask](https://metamask.io/) extension installed in your browser and have [`Polygon` network set up](https://docs.polygon.technology/docs/develop/metamask/config-polygon-on-metamask/)
* Run `npm install` at the root of the project to install the dependencies 

### Run the project
* Run `npm run dev`
* Hit `localhost:3000`

---
## Tech stack
* [Skynet for deployment](https://docs.skynetlabs.com/developer-guides/deploy-github-actions)
* SolidJS, ZagJS, TailwindCSS
* ethers, wagmi/core
* Lens Protocol
* urql

---
This project was created during [Skynet Summer 2022 Developer Program](https://skynetlabs.com/news/announcing-skynet-developer-program/).

---

- **Account**
    - [x]  [as anyone with a wallet] claim handle
    - [x]  [as an authenticated user with an account] select default account
    - [x]  [as an authenticated user with an account] delete account
    

---

- **Profile**
    - Data
        - [x]  [as an authenticated user with an account] Update profile
        - [x]  [as anyone] Display an existing profile page
    - Follow
        - [x]  [as an authenticated user with an account/anyone with a wallet] Follow a profile
        - [x]  [as a follower] Unfollow a profile
        - [x]  [as  an authenticated user with an account] Update follow module
    - Tip/support tiers
        - [ ]  [as an authenticated user with an account] Set support tiers (tipping)
        - [ ]  [as  an authenticated user with an account] Tip using the support tier ( *→ uses Lens publication collect module under the hood*)
    - [ ]  Search for a profile (criteria tbd)
    

---

- **Game**
    - [ ]  [as an authenticated user with an account] Create a game  ( *→ uses Lens publication collect module under the hood*)
    - [ ]  [as anyone] Display a game page
    - [ ]  [as an authenticated user with an account] Buy a game
    - [ ]  [as an authenticated user with an account and a game bought] Download game / access game (→ uses Lit protocol to gate access ?)
    - [ ]  [as an authenticated user that created a game] Publish game updates
    - [ ]  [as anyone] search a game (which criteria?)
    

---

- **Dashboard** [gated: authenticated user with an account]
    - Tip/support tiers
        - [ ]  Display total tips $$$
        - [ ]  Display followers list
        - [ ]  Display created games
        - [ ]  Display total games sold $$$
    - Posts
        - [ ]  List my posts
        - [ ]  Create a post
    - Community
        - [ ]  Create a community
        - [ ]  Update a community
        - [ ]  Delete a community
        - [ ]  List my communities
        

---

- **Communities**
    - [ ]  Join a community (can be gated)
    - [ ]  Leave a community
    - [ ]  Publish in a community (can be gated)