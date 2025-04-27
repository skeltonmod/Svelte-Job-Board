<script>
	import {
		Content,
		Header,
		HeaderNav,
		HeaderNavItem,
		SkipToContent
	} from 'carbon-components-svelte';
	import "../app.css";
	import 'carbon-components-svelte/css/g10.css';
</script>

<svelte:head>
	<title>Job Board</title>
</svelte:head>

<Header platformName="Job Board">
	<svelte:fragment slot="skip-to-content">
		<SkipToContent />
	</svelte:fragment>
	<HeaderNav>
		<HeaderNavItem href="/" text="Home" />
		<HeaderNavItem href="/admin" text="Admin" />
		<HeaderNavItem href="/submit" text="Post a Job" />
	</HeaderNav>
</Header>

<Content>
	<slot />
</Content>

