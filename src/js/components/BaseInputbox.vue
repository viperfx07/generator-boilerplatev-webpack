<template lang="pug">
	label.b-fsinputsmall.u-df.u-fw400.o-inputbox(:for="id", :class="_class")
		input.sr-only(
			:id="id",
			:type="type"
			:name="name",
			:value="value",
			:disabled="disabled",
			:checked="isChecked",
			@change="updateInput",
			@blur.native="$emit('blur', $event)"
		)
		span.u-db.u-posr.u-tac.u-fxs0.u-mrb2.o-inputbox__box(aria-hidden="true")
			BaseIcon(name='check16').u-absolute-center.u-fill-fff.u-o0.o-inputbox__tick
			span.u-dn.u-absolute-center.u-w8.u-h8.u-bdra50p.u-bgc-fff.u-o0.o-inputbox__tick.o-inputbox__tick--circle
		span.u-fx1.u-db
			span.o-inputbox__text(v-html="label")
			slot
</template>

<script>
import BaseIcon from '@/components/BaseIcon.vue'
export default {
	components: {
		BaseIcon,
	},
	model: {
		prop: 'modelValue',
		event: 'change',
	},
	props: {
		id: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			default: '',
		},
		label: {
			type: String,
			default: '',
		},
		value: {
			type: [String, Array, Object],
			default: '',
		},
		type: {
			type: String,
			default: 'checkbox',
		},
		disabled: Boolean,
		modelValue: {
			type: [Boolean, String, Object],
			default: false,
		},
		trueValue: {
			type: [Boolean, String, Object],
			default: true,
		},
		falseValue: {
			type: [Boolean, String, Object],
			default: false,
		},
	},
	computed: {
		_class() {
			return {
				[`o-inputbox--${this.type}`]: true,
			}
		},
		isChecked() {
			if (this.type == 'radio') {
				return this.modelValue == this.value
			}

			if (Array.isArray(this.modelValue)) {
				return this.modelValue.includes(this.value)
			}

			// Note that `true-value` and `false-value` are camelCase in the JS
			return this.modelValue === this.trueValue
		},
	},
	methods: {
		updateInput(e) {
			if (this.type == 'radio') {
				this.$emit('change', this.value, e)
			} else {
				let isChecked = e.target.checked

				if (Array.isArray(this.modelValue)) {
					let newValue = [...this.modelValue]

					if (isChecked) {
						newValue.push(this.value)
					} else {
						newValue.splice(newValue.indexOf(this.value), 1)
					}

					this.$emit('change', newValue, e)
				} else {
					this.$emit('change', isChecked ? this.trueValue : this.falseValue, e)
				}
			}
		},
	},
}
</script>
