<template lang="pug">
	component(
		:is="component"
		:type="componentType"
		:class="componentClass"
		@click="$emit('click', $event)"
		:to="to"
		:disabled="component == 'button' && disabled"
	)
		slot
		slot(name="icon")
</template>

<script>
export default {
	props: {
		component: {
			type: String,
			default: 'button',
		},
		size: {
			type: String,
			default: '',
		},
		variant: {
			type: String,
			default: 'primary',
		},
		to: {
			type: [String, Object],
			default: null,
		},
		backgroundColor: {
			type: String,
			default: '',
		},
		borderColor: {
			type: String,
			default: '',
		},
		disabled: Boolean,
	},
	computed: {
		componentType() {
			return !this.component || this.component === 'button' ? 'button' : false
		},
		componentClass() {
			const { size, variant, backgroundColor, borderColor, disabled } = this
			return {
				'o-btn': true,
				[`o-btn--${size}`]: !!size,
				[`o-btn--${variant}`]: !!variant,
				[`o-btn--bgc-${backgroundColor}`]: !!backgroundColor,
				[`o-btn--bd-${borderColor}`]: !!borderColor,
				'is-disabled': disabled,
			}
		},
	},
	mounted() {
		this.$emit('mounted')
	},
}
</script>
