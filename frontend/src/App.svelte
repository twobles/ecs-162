<script lang="ts">
  import { onMount } from 'svelte';
  import NYTHead from './assets/NewYorkTimesHead.png'
  import Article1Img from './assets/Article1.jpeg'
  import Article2Img from './assets/Article2.jpg'
  import Article3Img from './assets/Article3.jpg'
  import Article4Img from './assets/Article4.jpeg'
  import Article5Img from './assets/Article5.jpg'
  import Article6Img from './assets/Article6.jfif'

  let apiKey: string = '';

  let date: string = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })

  onMount(async () => {
    try {
      const res = await fetch('/api/key');
      const data = await res.json();
      apiKey = data.apiKey;
    } catch (error) {
      console.error('Failed to fetch API key:', error);
    }
  });
</script>

<main>
  <header>
      <img src={NYTHead} alt="New York Times logo" class="nyt-head">
      <div class="page-info">
          <p class="page-date">{date}</p>
          <span class="page-meta">Today's Paper</span>
      </div>
      <nav>
          <ul>
              <li>U.S.</li>
              <li>World</li>
              <li>Business</li>
              <li>Arts</li>
              <li>Lifestyle</li>
              <li>Opinion</li>
              <li>Audio</li>
              <li>Games</li>
              <li>Cooking</li>
          </ul>
      </nav>
  </header>
  <hr>
  <div class="column-container">
      <article class="column">
          <h1>The Ever Popular Golden</h1>
          <p>
              The Golden Retriever, an exuberant Scottish gundog of great beauty, stands among America's most popular dog breeds. They are serious workers at hunting and field work, as guides for the blind, and in search-and-rescue, enjoy obedience and other competitive events, and have an endearing love of life when not at work. The Golden Retriever is a sturdy, muscular dog of medium size, famous for the dense, lustrous coat of gold that gives the breed its name. The broad head, with its friendly and intelligent eyes, short ears, and straight muzzle, is a breed hallmark.
          </p>
          <img src={Article1Img} alt="Two golden retriver puppies in a field of grass and orange flowers" class="article-img">
      </article>
      <article class="column">
          <h1>Fun-Sized Corgis</h1>
          <p>
              Among the most agreeable of all small housedogs, the Pembroke Welsh Corgi is a strong, athletic, and lively little herder who is affectionate and companionable without being needy. They are one the world's most popular herding breeds. At 10 to 12 inches at the shoulder and 27 to 30 pounds, a well-built male Pembroke presents a big dog in a small package. Short but powerful legs, muscular thighs, and a deep chest equip him for a hard day's work. Built long and low, Pembrokes are surprisingly quick and agile. They can be red, sable, fawn, and black and tan, with or without white markings.
          </p>
          <img src={Article2Img} alt="A corgi puppy sitting on a table" class="article-img">
      </article>
      <article class="column">
          <h1>Enthusiastic, Full of Energy: Border Collies</h1>
          <p>
              A remarkably bright workaholic, the Border Collie is an amazing dog'maybe a bit too amazing for owners without the time, energy, or means to keep it occupied. These energetic dogs will settle down for cuddle time when the workday is done. Borders are athletic, medium-sized herders standing 18 to 22 inches at the shoulder. The overall look is that of a muscular but nimble worker unspoiled by passing fads. Both the rough coat and the smooth coat come in a variety of colors and patterns.
          </p>
          <img src={Article3Img} alt="A border collie puppy laying in a lawn" class="article-img">
      </article>
      <article class="column">
          <h1>Dog From Down Under</h1>
          <p>
              The Australian Shepherd, a lean, tough ranch dog, is one of those 'only in America' stories: a European breed perfected in California by way of Australia. Fixtures on the rodeo circuit, they are closely associated with the cowboy life. The Australian Shepherd, the cowboy's herding dog of choice, is a medium-sized worker with a keen, penetrating gaze in the eye. Aussie coats offer different looks, including merle (a mottled pattern with contrasting shades of blue or red). In all ways, they're the picture of rugged and agile movers of stock. Aussies exhibit an irresistible impulse to herd, anything: birds, dogs, kids.
          </p>
          <img src={Article4Img} alt="An Australian shepard laying on the forest floor" class="article-img">
      </article>
      <article class="column">
          <h1>Much Fluff, Such Wow</h1>
          <p>
              An ancient Japanese breed, the Shiba Inu is a little but well-muscled dog once employed as a hunter. Today, the spirited, good-natured Shiba is the most popular companion dog in Japan. The adaptable Shiba is at home in town or country. Brought to America from Japan as recently as 60 years ago, Shibas are growing in popularity in the West and are already the most popular breed in their homeland. Their white markings combined with their coloring (red, red sesame, or black and tan) and their alert expression and smooth stride makes them almost foxlike. They're sturdy, muscular dogs with a bold, confident personality to match.
          </p>
          <img src={Article5Img} alt="A shiba inu laying down inside" class="article-img">
      </article>
      <article class="column">
          <h1>Loud, But Lovable</h1>
          <p>
              Siberian Husky, a thickly coated, compact sled dog of medium size and great endurance, was developed to work in packs, pulling light loads at moderate speeds over vast frozen expanses. Sibes are friendly, fastidious, and dignified. The graceful, medium-sized Siberian Husky's almond-shaped eyes can be either brown or blue'and sometimes one of each'and convey a keen but amiable and even mischievous expression. Quick and nimble-footed, Siberians are known for their powerful but seemingly effortless gait. Tipping the scales at no more than 60 pounds, they are noticeably smaller and lighter than their burly cousin, the Alaskan Malamute.
          </p>
          <img src={Article6Img} alt="A husky laying down in the snow" class="article-img">
      </article>
  </div>
</main>
