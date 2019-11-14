<template lang="pug">
	svg.u-fxs0.u-fill-cc.o-icon(
		aria-hidden="true"
		:class="className"
	)
		use(
			:xlink:href="`#${name}`"
		)
</template>

<script>
export default {
	props: {
		name: {
			type: String,
			required: true,
		},
	},
	computed: {
		className() {
			const { name } = this
			let iconSizeClass = 'o-icon--'

			if (name.includes('12')) {
				iconSizeClass += 'xs'
			} else if (name.includes('16')) {
				iconSizeClass += 's'
			} else if (name.includes('24')) {
				iconSizeClass += 'm'
			} else if (name.includes('32')) {
				iconSizeClass += 'l'
			} else if (name.includes('36')) {
				iconSizeClass += 'xl'
			} else {
				iconSizeClass = ''
			}

			return {
				[iconSizeClass]: !!iconSizeClass,
			}
		},
	},
}
</script>
