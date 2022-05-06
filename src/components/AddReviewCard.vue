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
      input(type="number" :step="0.5" v-model="reviewStars" :max="5" :min="0" @change="setRating()")
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
      return parseFloat(this.reviewStars)
    },
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
    input {
      outline: none;
      background: #fff;
      border: 1px solid #dfe5ea;
      border-radius: 10px;
      color: #313131;
      font-size: 12px;
      padding: 4px 12px;
      margin-bottom: 4px;
      margin-left: 7px;
      max-width: 80px;
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
</style>
