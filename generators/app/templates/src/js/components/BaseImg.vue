<template lang="pug">
component(
	:is="tag"
	class="u-ofc"
)
	source(
		:data-srcset="source.srcsetStr"
		:media="source.media"
		:type="source.type"
		v-for="source in sourcesWithSrcsetStr"
	)
	img.u-w100p.u-ofc.js-lazysizes(
		data-sizes="auto"
		:data-src="src"
		:alt="alt"
	)
</template>

<script>
export default {
	props: {
		tag: {
			type: String,
			default: 'picture',
		},
		src: {
			type: String,
			default: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
		},
		sources: {
			type: Array,
			default: undefined,
		},
		srcset: {
			type: Array,
			default: undefined,
		},
		alt: {
			type: String,
			default: '',
		},
	},
	computed: {
		sourcesWithSrcsetStr() {
			return this.sources.map(source => ({
				...source,
				srcsetStr: source.srcset
					.map(srcset => ({
						...srcset,
						srcsetStr: `${srcset.src} ${srcset.descriptor}`.trim(),
					}))
					.map(item => item.srcsetStr)
					.join(','),
			}))
		},
	},
}
</script>
