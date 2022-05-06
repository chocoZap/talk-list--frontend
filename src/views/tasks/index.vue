<template lang="pug">
  .main
    .recommend-wrap
      .recommend-content
        p.recommend-title 今日のおすすめ
        p.recommend-talk {{ recommendTalk }}
      button.shuffle-btn(@click="setRecommendTalk()") 変更
    .add-btn-wrap
      button.add-btn(@click="changeMode()") {{ addList? "キャンセル" : "新規作成" }}
    .table-wrap
      table
        thead.table-header
          tr
            th(:colspan="2") テーマ一覧
        tbody.table-body
          tr.input-wrap(v-show="addList")
            td.input
              input(type="text" v-model="content")
            td
              span(@click="addTalkContent") 追加
          tr(v-for="talkList in talkLists")
            td
              p(v-text="talkList.content")
              star-rating(
                v-model="talkList.reviewScore"
                :increment="0.1"
                :star-points="[23,2, 14,17, 0,19, 10,34, 7,50, 23,43, 38,50, 36,34, 46,19, 31,17]"
                :star-size="12"
                text-class="star-text"
                read-only
              )
            td.btn-wrap
              span(@click="openDetailModal(talkList)") 詳細
    confirm-modal(ref="confirm")
    detail-modal(ref="detail" :select-item="selectItem" @close-event="resetSelectItem()")
</template>
<script>
import StarRating from 'vue-star-rating'
import ConfirmModal from '@/components/Modal/ConfirmModal'
import DetailModal from '@/components/Modal/DetailModal.vue'
import { mapState, mapActions } from 'vuex'

export default {
  components: {
    StarRating,
    ConfirmModal,
    DetailModal,
  },
  data() {
    return {
      content: '',
      addList: false,
      preventClick: false,
      recommendTalk: '',
      selectItem: {
        content: '',
        count: '',
        reviewScore: 0,
        reviews: []
      },
    }
  },
  computed: {
    ...mapState({
      talkLists: (state) => state.talkList.talkLists
    }),
  },
  mounted() {
    this.getTalkLists()
  },
  methods: {
    ...mapActions({
      loadTalkLists: 'talkList/index',
      store: 'talkList/store',
      deleteTalkList: 'talkList/delete'
    }),
    /**
     * シャッフル
     *
     * @param {Array} array トークリストの配列
     * @returns {Array} array シャッフルされたトークリストの配列
     *
     */
    shuffle(array) {
      for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    },
    /**
     * 選択したトーク内容をリセットする
     */
    async resetSelectItem() {
      await this.getTalkLists()
      this.selectItem = {}
    },
    /**
     * トークリストの取得
     */
    async getTalkLists() {
      const res = await this.loadTalkLists()
      if (res.status === 200) {
        this.setRecommendTalk()
        this.setReviewsCount()
      }
    },
    /**
     * 今日のおすすめの取得
     *
     */
    setRecommendTalk() {
      const items = this.talkLists.map((talkList) => talkList.content)
      this.recommendTalk = this.shuffle(items).shift()
    },
    /**
     * レビューをセットする
     */
    setReviewsCount() {
      for (const item of this.talkLists) {
        const num = item.reviews.length
        let reviewScore = 0
        if (num > 0) {
          const sum = item.reviews.map(item => item.stars).reduce((acc, cur) => {
            return parseFloat(acc) + parseFloat(cur)
          })
          reviewScore = sum / num
        }
        item.count = `${num}件`
        item.reviewScore = parseFloat(reviewScore)
      }
    },
    /**
     * トーク内容の新規追加
     *
     */
    async addTalkContent() {
      if (this.preventClick) return
      this.preventClick = true
      const status = await this.store({ content: this.content })
      if (status === 200) {
        this.content = ''
        this.preventClick = false
        this.addList = false
        this.getTalkLists()
      }
    },
    /**
     * 新規作成モードを変更する
     */
    changeMode() {
      this.addList = !this.addList
      this.content = ''
    },
    /**
     * レビュー表示モーダルを表示する
     *
     * @param {Object} item 選択したトーク
     *
     */
    openDetailModal(item) {
      this.selectItem = item
      this.$refs.detail.dialog = true
    }
  },
}
</script>

<style lang="scss" scoped>
.main {
  padding: 0 20px;
  margin-top: 110px;
  background: #f8f8f8;
  max-height: 100vh;
  overflow: hidden;
  .recommend-wrap {
    color: #313131;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 30px 14px 14px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 3px 16px #dfe5ea;
    .recommend-content {
      display: flex;
      p {
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 0;
        &.recommend-title::after {
          content: '：';
        }
        &.recommend-talk {
          padding-left: 10px;
        }
      }
      @media screen and (max-width: 767px) {
        flex-direction: column;
        max-width: 70%;
        p {
          &.recommend-title {
            font-size: 0.75rem;
            &::after {
              display: none;
            }
          }
          &.recommend-talk {
            font-size: 1rem;
            padding-left: 0;
          }
        }
      }
    }
    .shuffle-btn {
      background: #2b7bcb;
      border-radius: 10px;
      color: #fff;
      font-weight: 600;
      letter-spacing: 0.7px;
      padding: 10px;
      @media screen and (max-width: 767px) {
        max-width: 55px;
        max-height: 55px;
      }
    }
  }
  .add-btn-wrap {
    padding: 25px 15px 25px 0;
    text-align: right;
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
  .table-wrap {
    width: 100%;
    height: calc(100vh - 243px);
    max-height: calc(100vh - 243px);
    overflow: auto;
    table {
      width: 100%;
      height: 100%;
      max-height: 100%;
      .table-header {
        tr {
          width: 100%;
          th {
            position: sticky;
            top: 0;
            z-index: 100;
            background: #f8f8f8;
            color: #313131;
            font-size: 1rem;
            font-weight: 600;
            border-bottom: 1px solid #dfe5ea;
            padding-bottom: 14px;
            text-align: left;
            padding-left: 10px;
          }
        }
      }
      .table-body {
        tr {
          width: 100%;
          td {
            color: #313131;
            font-size: 1rem;
            font-weight: 600;
            border-bottom: 1px solid #dfe5ea;
            padding: 19px 0;
            p {
              margin-bottom: 0;
            }
            ::v-deep .star-text {
              font-size: 14px;
            }
            span {
              background: #2b7bcb;
              color: #fff;
              padding: 10px;
              border-radius: 10px;
              cursor: pointer;
            }
            &:first-of-type {
              padding-left: 10px;
            }
            &:last-of-type {
              min-width: 100px;
              text-align: right;
              padding-right: 30px;
            }
          }
          &.input-wrap {
            td {
              text-align: left;
              input {
                width: 50%;
                outline: none;
                background: #fff;
                border-radius: 10px;
                box-shadow: 0 3px 16px #dfe5ea;
                padding: 8px 0 8px 12px;
                @media screen and (max-width: 767px) {
                  width: 100%;
                }
              }
              span {
                background: #fff;
                color: #2b7bcb;
                cursor: pointer;
              }
              &:last-of-type {
                text-align: right;
                padding-right: 30px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
