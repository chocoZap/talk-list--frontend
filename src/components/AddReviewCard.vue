<template lang="pug">
  .review-content-wrap.border-blue
    .star-wrap
      star-rating(
        v-model="starScore"
        :increment="0.5"
        :star-points="[23,2, 14,17, 0,19, 10,34, 7,50, 23,43, 38,50, 36,34, 46,19, 31,17]"
        :star-size="20"
        read-only
        :show-rating="false"
      )
      input(type="number" :step="0.5" v-model="reviewStars" max="5" min="0" @change="setRating()")
      transition(name="number")
        span(v-if="reviewStars < 0 || reviewStars > 5" class="description_top" v-text="errorMessage")
    textarea.textarea(type="text" v-model="reviewComment" @input="$emit('input-event', reviewComment)")
</template>

<script>
import StarRating from 'vue-star-rating'

export default {
  components: {
    StarRating,
  },
  data: () => ({
    reviewComment: '',
    reviewStars: 0,
  }),
  computed: {
    starScore() {
      if (this.reviewStars > 5 || this.reviewStars < 0) return 0
      return parseFloat(this.reviewStars)
    },
    errorMessage() {
      const num = parseFloat(this.reviewStars)
      const isUnderFiveAndAboveZero = num > 0 && num <= 5
      const isDivideIntoZeroPointFive = num % 0.5 === 0
      if (isUnderFiveAndAboveZero && isDivideIntoZeroPointFive) {
        return ''
      } else if (isDivideIntoZeroPointFive) {
        return '0以上5以下で入力してください'
      } else if (isUnderFiveAndAboveZero) {
        return '0.5pt単位で入力してください'
      } else {
        return '0以上5以下で入力してください\n0.5pt単位で入力してください'
      }
    }
  },
  methods: {
    setRating() {
      this.$emit('set-rating', this.starScore)
    }
  }
}
</script>

<style lang="scss" scoped>
.review-content-wrap {
  border: 1px solid #dfe5ea;
  border-radius: 7px;
  margin-bottom: 10px;
  padding: 5px 15px;
  border: 1px solid #2b7bcb;
  .star-wrap {
    display: flex;
    margin: 10px 0 5px;
    position: relative;
    input {
      outline: none;
      background: #fff;
      border: 1px solid #dfe5ea;
      border-radius: 10px;
      color: #313131;
      font-size: 12px;
      padding: 0 12px;
      margin-left: 7px;
      max-width: 80px;
      line-height: 32px;
    }
    span {
      font-size: 0.75rem;
      font-weight: 600;
      color: #E83929;
      line-height: 20px;
      margin-left: 7px;
      white-space: pre-wrap;
      width: 200px;
      &.description_top { /* ツールチップのスタイル */
        position: absolute;
        left: 25%;
        bottom: 100%; /* Y軸の位置 */
        margin-bottom: 8px; /* テキストとの距離 */
        padding: 8px;
        border-radius: 10px; /* 角の丸み */
        background-color: #fff;
        box-shadow: 0 3px 16px #dfe5ea;
        text-align: center;
        z-index: 9999;
        animation: move 1s ease-in-out infinite;
      }
    }
  }
  textarea {
    -webkit-appearance: none;
    outline: none;
    background: #fff;
    border-radius: 10px;
    color: #313131;
    border: 1px solid #dfe5ea;
    padding: 8px 0 8px 12px;
    width: 100%;
  }
}
.number {
  &-enter-active,
  &-leave-active {
    opacity: 0;
  }
  &-enter,
  &-leave-to {
    transition: opacity .2s;
  }
}
/*下からの距離が変化して全体が下→上→下に動く*/
@keyframes move{
  0% {
    bottom: 100%;
  }
  50%{
    bottom: 97%;
  }
  100%{
    bottom: 100%;
  }
}
</style>
