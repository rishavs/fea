import { PostSummary } from '../../models/posts';

export const cardItem = (post: PostSummary) => {
	return /*html*/ `
<li class="link-hover">
	<a href="/posts/${post.slug}" class="flex flex-col gap-1">
		<span class="">[${post.score}] ${post.description}</span>
		<span class="text-sm opacity-60">${post.category}</span>
	</a>
</li>
`;
};

export const buildSummaryCards = () => {
	let trendingPosts: PostSummary[] = [];
	for (let i = 1; i <= 10; i++) {
		trendingPosts.push(
			new PostSummary(
				`post-${i}`,
				`Category ${i}` as any, // Assuming categories are strings, adjust as necessary
				`Post ${i} Description`,
				i * 100
			)
		);
	}

	let topPosts: PostSummary[] = [];
	for (let i = 1; i <= 10; i++) {
		topPosts.push(
			new PostSummary(
				`top-post-${i}`,
				`Category ${i}` as any, // Assuming categories are strings, adjust as necessary
				`Top Post ${i} Description`,
				i * 200
			)
		);
	}

	let friendsPosts: PostSummary[] = [];
	for (let i = 1; i <= 10; i++) {
		friendsPosts.push(
			new PostSummary(
				`friend-post-${i}`,
				`Category ${i}` as any, // Assuming categories are strings, adjust as necessary
				`Friend's Post ${i} Description`,
				i * 50
			)
		);
	}

	return /*html*/ `
	<ul class="list bg-base-100 rounded-box shadow-md">
  
  <li class="p-4 pb-2 text-xs opacity-60 tracking-wide">Most played songs this week</li>
  
  <li class="list-row">
    <div><img class="size-10 rounded-box" src="https://img.daisyui.com/images/profile/demo/1@94.webp"/></div>
    <div>
      <div>Dio Lupa</div>
      <div class="text-xs uppercase font-semibold opacity-60">Remaining Reason</div>
    </div>
    <button class="btn btn-square btn-ghost">
      <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor"><path d="M6 3L20 12 6 21 6 3z"></path></g></svg>
    </button>
    <button class="btn btn-square btn-ghost">
      <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></g></svg>
    </button>
  </li>
  
  <li class="list-row">
    <div><img class="size-10 rounded-box" src="https://img.daisyui.com/images/profile/demo/4@94.webp"/></div>
    <div>
      <div>Ellie Beilish</div>
      <div class="text-xs uppercase font-semibold opacity-60">Bears of a fever</div>
    </div>
    <button class="btn btn-square btn-ghost">
      <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor"><path d="M6 3L20 12 6 21 6 3z"></path></g></svg>
    </button>
    <button class="btn btn-square btn-ghost">
      <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></g></svg>
    </button>
  </li>
  
  <li class="list-row">
    <div><img class="size-10 rounded-box" src="https://img.daisyui.com/images/profile/demo/3@94.webp"/></div>
    <div>
      <div>Sabrino Gardener</div>
      <div class="text-xs uppercase font-semibold opacity-60">Cappuccino</div>
    </div>
    <button class="btn btn-square btn-ghost">
      <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor"><path d="M6 3L20 12 6 21 6 3z"></path></g></svg>
    </button>
    <button class="btn btn-square btn-ghost">
      <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></g></svg>
    </button>
  </li>
  
</ul>

<ul class="menu bg-base-100 text-base-content w-80 rounded-box border border-base-300 shadow">
	<li class="menu-title">Visited Posts</li>
    <!-- empty list -->
</ul>
<ul class="menu bg-base-100 text-base-content w-80 rounded-box border border-base-300 shadow">
	<li class="menu-title">Trending Posts</li>
    ${trendingPosts.map(cardItem).join('\n')}
</ul>
<ul class="menu bg-base-100 text-base-content w-80 rounded-box border border-base-300 shadow">
	<li class="menu-title">Top Posts</li>
    ${topPosts.map(cardItem).join('\n')}
</ul>
<ul class="menu bg-base-100 text-base-content w-80 rounded-box border border-base-300 shadow">
    <li class="menu-title">Friends' Posts</li>
    ${friendsPosts.map(cardItem).join('\n')}
</ul>
`;
};
