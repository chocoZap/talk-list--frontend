<template lang="pug">
  .review-content-wrap(:id="`review-${review.id}`")
    star-rating(
      v-model="review.stars"
      :increment="0.1"
      :star-points="[23,2, 14,17, 0,19, 10,34, 7,50, 23,43, 38,50, 36,34, 46,19, 31,17]"
      :star-size="12"
      text-class="star-text"
      read-only
    )
    p.create-date(v-text="`投稿日: ${formatDate(review.created_at)}`")
    pre.review-comment(:class="{ 'shortcut-comment': isLong }" v-text="review.comment")
    button.display-all-comment(v-if="isLong" :id="`display-button-${review.id}`" @click="displayAll()" v-text="'すべて表示'")
</template>

<script>
import StarRating from 'vue-star-rating'
import moment from "moment"
moment.locale("ja")

export default {
  components: {
    StarRating,
  },
  props: {
    review: {
      type: Object,
      required: false,
      default: () => [],
    },
  },
  data: () => ({
    isLong: false,
    isDisplayAll: false,
  }),
  computed: {
    formatDate() {
      return function(date) {
        return moment(date).format('YYYY/MM/DD')
      }
    },
    starScore() {
      return parseFloat(this.review.stars)
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.setTextEllipsis(this.review.id)
    })
  },
  methods: {
    setTextEllipsis(id) {
      const content = document.getElementById(`review-${id}`)
      if (content && content.offsetHeight > 150) {
        this.isLong = true
      }
    },
    displayAll() {
      this.isLong = false
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
  ::v-deep .star-text {
    font-size: 14px;
  }
  .display-all-comment {
    box-shadow: 0 3px 16px #dfe5ea;
    background: #fff;
    color: #2b7bcb;
    border-radius: 10px;
    font-weight: 600;
    font-size: .75rem;
    width: 100%;
    line-height: 25px;
    &.display-none {
      display: none;
    }
  }
  pre,
  p {
    margin-bottom: 0;
    text-align: left;
    font-size: 0.875rem;
  }
  pre {
    display: -webkit-box;
    white-space: pre-wrap;
    &.shortcut-comment {
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
    }
  }
  p .create-date {
    font-size: 12px;
    margin-bottom: 7px;
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
  &.border-blue {
    border: 1px solid #2b7bcb;
  }
}
</style>
