<template lang="pug">
  div.main
    div.recommend-wrap
      div.recommend-content
        p 今日のおすすめ:
        p {{ recommendTalk }}
      button.shuffle-btn(@click="setRecommendTalk()") 変更
    div.add-btn-wrap
      button.add-btn(@click="addList = !addList") {{ addList? "キャンセル" : "新規作成" }}
    div.table-wrap
      table
        thead.table-header
          tr
            th テーマ一覧
            th 詳細
        tbody.table-body
          tr.input-wrap(v-show="addList")
            td.input
              input(type="text" v-model="content")
            td
              span(@click="addTalkContent") 追加
          tr(v-for="talkList in talkLists")
            td {{ talkList.content }}
            td
              span 詳細
    create-modal(ref="create")
    detail-modal(ref="detail")
</template>
<script>
import { mapState, mapActions } from 'vuex'
import CreateModal from '@/components/Modal/CreateModal.vue'
import DetailModal from '@/components/Modal/DetailModal.vue'

export default {
  components: {
    CreateModal,
    DetailModal,
  },
  data() {
    return {
      content: '',
      addList: false,
      preventClick: false,
      recommendTalk: '',
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
     * トークリストの取得
     *
     */
    async getTalkLists() {
      const res = await this.loadTalkLists()
      if (res.status === 200) {
        this.setRecommendTalk()
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
     * トーク内容の新規追加
     *
     */
    async addTalkContent() {
      if (this.preventClick) return
      this.preventClick = true
      const status = await this.store({ content: this.content })
      if (status === 200) {
        this.$refs.create.dialog = true
        this.content = ''
        this.preventClick = false
        this.addList = false
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.main {
  padding: 0 20px;
  margin-top: 110px;
  background: #f8f8f8;
  .recommend-wrap {
    color: #313131;
    display: flex;
    justify-content: space-between;
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
        &:last-of-type {
          padding-left: 10px;
        }
      }
    }
    .shuffle-btn {
      background: #2b7bcb;
      border-radius: 10px;
      color: #fff;
      font-weight: 600;
      letter-spacing: 0.7px;
      padding: 0 10px;
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
    overflow: auto;
    table {
      width: 100%;
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
            &:last-of-type {
              text-align: right;
              padding-right: 40px;
            }
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
