<template lang="pug">
  v-dialog(v-model="dialog" persistent content-class="detail-modal-wrap" width="640")
    .card-wrap
      p.card-title(v-text="selectItem.content")
      .review-wrap
        .total-score-wrap
          .left-item-wrap
            p(v-text="'評価点'")
            star-rating(
              v-model="selectItem.reviewScore"
              :increment="0.1"
              :star-points="[23,2, 14,17, 0,19, 10,34, 7,50, 23,43, 38,50, 36,34, 46,19, 31,17]"
              :star-size="12"
              read-only
            )
          button.add-btn(v-show="!reviewMode" @click="reviewMode = true" v-text="'レビューを投稿する'")
        template(v-if="reviewMode")
          add-review-card(ref="addReviewCard" @set-rating="reviewStars = $event" @input-event="reviewComment = $event")
        template(v-for="review in selectItem.reviews")
          review-card(:review="review")
        template(v-if="selectItem.reviews.length === 0 && !reviewMode")
          p.no-review-text(v-text="'まだ誰もレビューを投稿してません'")
    .button-wrap
      button.back-btn(@click="closeDialog()" v-text="'閉じる'")
      template(v-if="isRegister")
        loading-btn(@click-event="createReview()" ref="loadingBtn")
</template>

<script>
import LoadingBtn from '@/components/LoadingButton.vue'
import ReviewCard from '@/components/ReviewCard.vue'
import AddReviewCard from '@/components/AddReviewCard.vue'
import StarRating from 'vue-star-rating'
import moment from "moment"
moment.locale("ja")
import { mapActions } from 'vuex'

export default {
  components: {
    StarRating,
    ReviewCard,
    AddReviewCard,
    LoadingBtn,
  },
  props: {
    selectItem: {
      type: Object,
      required: false,
      default: () => {},
    },
  },
  data: () => ({
    dialog: false,
    reviewMode: false,
    reviewComment: '',
    reviewStars: 0,
  }),
  computed: {
    isRegister() {
      const isReviewComment = this.reviewComment.trim().length > 0
      const isReviewStars = this.reviewStars > 0
      return isReviewComment && isReviewStars
    }
  },
  methods: {
    ...mapActions({
      store: 'reviews/store',
    }),
    async createReview() {
      this.$refs.loadingBtn.isLoading = true
      const data = {
        talkList_id: this.selectItem.id,
        comment: this.reviewComment,
        stars: this.reviewStars,
      }
      const status = await this.store(data)
      if (status === 200) {
        this.closeDialog()
        this.$refs.loadingBtn.isLoading = false
      }
    },
    closeDialog() {
      this.$emit('close-event')
      this.reviewMode = false
      this.dialog = false
      this.reviewMode = false
      this.reviewComment = ''
      this.reviewStars = 0
    }
  },
}
</script>

<style lang="scss" scoped>
::v-deep .detail-modal-wrap {
  background: #fff;
  border-radius: 15px;
  .card-title {
    border-bottom: 1px solid #dfe5ea;
    color: #313131;
    font-size: 1.1rem;
    font-weight: 600;
    padding: 15px 0;
    text-align: center;
  }
  .review-wrap {
    padding: 0 30px;
    .total-score-wrap {
      align-items: center;
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      .left-item-wrap {
        p {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 0;
          margin-right: 10px;
          text-align: left;
        }
        ::v-deep .star-text {
          font-size: 14px;
        }
      }
      .add-btn {
        box-shadow: 0 3px 16px #dfe5ea;
        background: #fff;
        color: #2b7bcb;
        padding: 10px;
        border-radius: 10px;
        font-weight: 600;
        font-size: 1rem;
      }
    }
    .no-review-text {
      text-align: center;
      color: #313131;
      line-height: 75px;
    }
  }
  .button-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px 0;
    button {
      border-radius: 10px;
      font-weight: 600;
      letter-spacing: 0.7px;
      padding: 10px;
      &.back-btn {
        background: #f8f8f8;
        color: #313131;
      }
      &.create-btn {
        background: #2b7bcb;
        color: #fff;
        margin-left: 10px;
      }
    }
  }
}
</style>

