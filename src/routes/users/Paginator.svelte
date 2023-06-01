<script lang="ts">
	import { page } from "$app/stores";
</script>

<p>{$page.data.count} total users</p>
<div class="paginator">
	<span>{$page.data.currentPage}/{$page.data.noPages} pages</span>
	<br />
	<a href="?pg=1"> &lt;&lt;</a>
	<a href="?pg={Math.max($page.data.currentPage - 1, 1)}"> &lt;</a>
	<a href="?pg={Math.min($page.data.currentPage + 1, $page.data.noPages)}">
		&gt;</a
	>
	<a href="?pg={$page.data.noPages}"> &gt;&gt;</a>
</div>
