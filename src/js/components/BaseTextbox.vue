<template lang="pug">
	div
		component.u-posr.u-w100p.u-fw400(
			:is="labelTag"
			v-bind="_labelAttrs"
		)
			slot(name="addon")

			//- need to use :value.prop for dynamic component - https://github.com/vuejs/vue/issues/6919
			component.o-input__input(
				ref="input"
				:is="tag"
				:value.prop="value"
				:class="_inputClass"
				v-bind="_inputAttrs"
				v-on="nonInputListeners"
				@input="$emit('input', $event.target.value)"
			)
				slot(name="select-options")
			span.u-dib.u-posa.u-t0.u-l0.u-mtb2.u-mlb2.o-input__text {{ label }}

			slot(name="count", v-if="maxLength < Infinity")
				.b-fsformxsmall.u-c-tertiary5.u-posa.u-b0.u-r0.u-mrb1.u-mbb1 {{ charCount }} / {{ maxLength }}
		span.caption.error.u-mtb0p5(v-if="!!error && showErrorMessage", v-html="error")
</template>

<script>
export default {
	props: {
		id: {
			type: String,
			default: '',
		},
		inputAttrs: {
			type: Object,
			default: () => {
				return {}
			},
		},
		label: {
			type: String,
			default: '',
		},
		labelAttrs: {
			type: Object,
			default: () => {
				return {}
			},
		},
		value: {
			type: String,
			default: '',
		},
		error: {
			type: [Boolean, String],
			default: '',
		},
		showErrorMessage: {
			type: Boolean,
			default: true,
		},
		withAddOn: {
			type: Boolean,
			default: false,
		},
		tag: {
			type: [Object, String],
			default: 'input',
		},
		labelTag: {
			type: [Object, String],
			default: 'label',
		},
		maxLength: {
			type: Number,
			default: Infinity,
		},
	},
	computed: {
		nonInputListeners() {
			const { input, ...rest } = this.$listeners
			return rest
		},
		_labelAttrs() {
			return {
				...this.labelAttrs,
				for: this.id || this.labelAttrs.for,
			}
		},
		_inputAttrs() {
			const { inputAttrs, comp, id, maxLength } = this
			return {
				...inputAttrs,
				type: comp ? inputAttrs.type : inputAttrs.type || 'text',
				required: true,
				id: id || inputAttrs.id,
				maxlength: maxLength < Infinity ? maxLength : inputAttrs.maxlength || '',
			}
		},
		_inputClass() {
			return {
				[`${this.inputAttrs.class}`]: !!this.inputAttrs.class,
				error: !!this.error,
			}
		},
		charCount() {
			return this.value?.length || 0
		},
	},
}
</script>
