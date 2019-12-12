<template lang="pug">
	.u-posr
		BaseImg(
			:sources="sources"
		)
</template>

<script>
import BaseImg from '@/components/BaseImg'
export default {
	components: {
		BaseImg,
	},
	data() {
		return {
			sources: [
				{
					srcset: [
						{
							src: 'https://unsplash.it/500/100',
							descriptor: '500w',
						},
						{
							src: 'https://unsplash.it/1200/200',
							descriptor: '1200w',
						},
					],
				},
			],
		}
	},
}
</script>

<style lang="scss" module></style>
