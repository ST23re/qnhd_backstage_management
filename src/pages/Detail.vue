<template>
  <div class="page">
    <div
      :style="{ height: `${scrollbarHeight}px`, transform: 'scale(1)' }"
      v-loading.lock="showLoad"
    >
      <el-scrollbar
        ref="scrollbar"
        @scroll="getScrollTop"
        style="height: 100%"
        v-show="Object.keys(detail.post).length"
      >
        <div
          v-infinite-scroll="loadMore"
          :infinite-scroll-immediate="false"
          :infinite-scroll-distance="60"
        >
          <button class="btn-ori btns" @click="router.go(-1)">
            <el-icon style="margin-right: 5px"
              ><ArrowLeftBold color="#ffffff" /></el-icon
            >返回
          </button>
          <div
            :class="[
              'post',
              detail.post.is_deleted ? 'is-deleted' : '',
              postParam.prosecuted_floor_id == 0 &&
              detail.post.id == postParam.prosecuted_post_id
                ? 'prosecuted'
                : '',
              postParam.user_record_floor_id == 0 &&
              detail.post.id == postParam.user_record_post_id
                ? 'userRecord'
                : '',
            ]"
          >
            <div class="header">
              <!-- 移动分区，搜分区，改tag，搜tag，标签，搜部门 -->

              <el-dropdown trigger="click" :hide-on-click="true">
                <div
                  class="sender"
                  :style="{
                    height: shrink ? '21px' : '24px',
                    lineHeight: shrink ? '21px' : '24px',
                  }"
                >
                  <el-icon class="icon"><Avatar /></el-icon>
                  <text class="ellipsis"
                    >{{
                      `${
                        detail.post.nickname?.length
                          ? detail.post.nickname
                          : "没名字的微友"
                      } `
                    }}{{
                      detail.post.type == 1
                        ? `(${detail.post.uid})`
                        : ` [ uid: ${detail.post.uid} ]`
                    }}
                  </text>
                </div>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="diary(detail.post.uid)">
                      用户日志
                    </el-dropdown-item>
                    <el-dropdown-item
                      @click="resetName(detail.post.uid, 0)"
                      divided
                    >
                      重置昵称
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>

              <div style="flex: 1"></div>

              <div style="display: flex; align-items: center">
                <el-dropdown trigger="click" :hide-on-click="false">
                  <div
                    class="depa"
                    v-if="detail.post.type == 1"
                    v-show="!shrink"
                  >
                    <div class="icon">
                      <img src="../assets/flag.svg" alt="" />
                    </div>
                    <text class="ellipsis">{{
                      detail.post.department?.name
                    }}</text>
                  </div>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="searchDepa"
                        >看同部门</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>

                <el-dropdown trigger="click" :hide-on-click="false">
                  <div class="tag" v-if="detail.post.tag" v-show="!shrink">
                    <div class="icon">
                      <img src="../assets/tag.svg" alt="#" />
                    </div>
                    <text class="ellipsis">{{ detail.post.tag?.name }}</text>
                  </div>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="searchTag"
                        >看同话题</el-dropdown-item
                      >
                      <el-dropdown-item
                        @click="dialog('更改话题', null)"
                        divided
                        :disabled="detail.post.is_deleted"
                        >更改话题</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>

                <el-dropdown trigger="click" :hide-on-click="false">
                  <div class="part" v-show="!shrink">
                    <div class="icon">
                      <img src="../assets/hive.svg" alt="" />
                    </div>
                    <text>{{ cal_type(detail.post.type) }}</text>
                  </div>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="searchPart"
                        >看同分区</el-dropdown-item
                      >
                      <el-dropdown-item
                        @click="dialog('移动分区', null)"
                        divided
                        :disabled="detail.post.is_deleted"
                        >移动分区</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>

                <div
                  class="campus"
                  v-if="detail.post.campus != 0"
                  v-show="!shrink"
                >
                  <div class="icon">
                    <el-icon><Place /></el-icon>
                  </div>
                  <text>{{
                    detail.post.campus == 1 ? "卫津路" : "北洋园"
                  }}</text>
                </div>

                <div
                  class="extra-tag"
                  @click="() => dialog('标签', null)"
                  v-if="!detail.post.is_deleted"
                  v-show="!shrink"
                >
                  <img src="../assets/etag.svg" alt="" /><text
                    style="color: #005187"
                    >标签</text
                  >
                </div>

                <div class="more">
                  <el-dropdown trigger="click" :hide-on-click="false">
                    <el-icon class="icon"><MoreFilled /></el-icon>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item>
                          <el-popconfirm
                            :title="
                              detail.post.commentable
                                ? '确认禁止评论？'
                                : '确认允许评论？'
                            "
                            @confirm="mpCommentable"
                            :icon="InfoFilled"
                            icon-color="#626AEF"
                          >
                            <template #reference>
                              <button class="dropdown-btn">
                                <text style="width: 100%; text-align: center">
                                  {{
                                    detail.post.commentable
                                      ? "禁止评论"
                                      : "允许评论"
                                  }}
                                </text>
                              </button>
                            </template>
                          </el-popconfirm>
                        </el-dropdown-item>

                        <el-dropdown-item
                          v-if="!isEmptyUrls(detail.post.image_urls)"
                        >
                          <el-popconfirm
                            title="确认删除帖子图片？"
                            @confirm="deletePostImg"
                            :icon="InfoFilled"
                            icon-color="#626AEF"
                          >
                            <template #reference>
                              <button class="dropdown-btn">
                                <text style="width: 100%; text-align: center"
                                  >删除图片</text
                                >
                              </button>
                            </template>
                          </el-popconfirm>
                        </el-dropdown-item>

                        <el-dropdown-item
                          divided
                          v-if="!detail.post.is_deleted"
                        >
                          <button
                            class="dropdown-btn"
                            @click="
                              dialog('删除原因', {
                                type: 'post',
                                is_deleted: detail.post.is_deleted,
                                itemId: detail.post.id,
                                option: 0,
                              })
                            "
                          >
                            <text style="width: 100%; text-align: center"
                              >删除帖子</text
                            >
                          </button>
                        </el-dropdown-item>
                        <el-dropdown-item v-else>
                          <el-popconfirm
                            title="确认恢复该帖子？"
                            @confirm="
                              deleteInfo = {
                                type: 'post',
                                is_deleted: detail.post.is_deleted,
                                itemId: detail.post.id,
                                option: 0,
                              };
                              deleteHandler();
                            "
                            :icon="InfoFilled"
                            icon-color="#626AEF"
                          >
                            <template #reference>
                              <button class="dropdown-btn">
                                <text style="width: 100%; text-align: center"
                                  >恢复帖子</text
                                >
                              </button>
                            </template>
                          </el-popconfirm>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
              </div>
            </div>

            <div
              class="title"
              :style="{ marginTop: detail.post.type == 1 ? '5.2px' : '10px' }"
            >
              <div
                :class="['etag', detail.post.e_tag]"
                v-if="detail.post.e_tag"
              >
                <text>{{
                  detail.post.e_tag == "recommend"
                    ? shrink
                      ? "加精"
                      : "加精帖"
                    : detail.post.e_tag == "theme"
                    ? shrink
                      ? "活动"
                      : "活动帖"
                    : shrink
                    ? "置顶"
                    : "置顶帖"
                }}</text>
              </div>
              <div class="solved" v-if="detail.post.type == 1">
                <div class="icon">
                  <img
                    :src="
                      detail.post.solved == 0
                        ? getImgSrc('unsolved.svg')
                        : detail.post.solved == 1 || detail.post.solved == 2
                        ? getImgSrc('solved.svg')
                        : detail.post.solved == 3
                        ? getImgSrc('dispatched.svg')
                        : ''
                    "
                    alt=""
                  />
                </div>
                <text>{{
                  detail.post.solved == 0
                    ? "未解决"
                    : detail.post.solved == 1
                    ? "已回复"
                    : detail.post.solved == 2
                    ? "已解决"
                    : detail.post.solved == 3
                    ? "已分发"
                    : ""
                }}</text>
              </div>
              <text>{{ detail.post.title }}</text>
            </div>

            <div
              style="
                display: flex;
                align-items: center;
                transform: scale(0.95) translateX(-2.5%);
              "
              v-show="shrink"
            >
              <el-dropdown trigger="click" :hide-on-click="false">
                <div class="depa" v-if="detail.post.type == 1">
                  <div class="icon">
                    <img src="../assets/flag.svg" alt="" />
                  </div>
                  <text>{{ detail.post.department?.name }}</text>
                </div>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="searchDepa"
                      >看同部门</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>

              <el-dropdown trigger="click" :hide-on-click="false">
                <div class="tag" v-if="detail.post.tag">
                  <div class="icon">
                    <img src="../assets/tag.svg" alt="#" />
                  </div>
                  <text>{{ detail.post.tag?.name }}</text>
                </div>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="searchTag"
                      >看同话题</el-dropdown-item
                    >
                    <el-dropdown-item
                      @click="dialog('更改话题', null)"
                      divided
                      :disabled="detail.post.is_deleted"
                      >更改话题</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>

              <el-dropdown trigger="click" :hide-on-click="false">
                <div class="part">
                  <div class="icon">
                    <img src="../assets/hive.svg" alt="" />
                  </div>
                  <text>{{ cal_type(detail.post.type) }}</text>
                </div>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="searchPart"
                      >看同分区</el-dropdown-item
                    >
                    <el-dropdown-item
                      @click="dialog('移动分区', null)"
                      divided
                      :disabled="detail.post.is_deleted"
                      >移动分区</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>

              <div class="campus" v-if="detail.post.campus != 0">
                <div class="icon">
                  <el-icon><Place /></el-icon>
                </div>
                <text>{{ detail.post.campus == 1 ? "卫津路" : "北洋园" }}</text>
              </div>

              <div
                class="extra-tag"
                @click="() => dialog('标签', null)"
                v-if="!detail.post.is_deleted"
              >
                <img src="../assets/etag.svg" alt="" /><text
                  style="color: #005187"
                  >标签</text
                >
              </div>
            </div>

            <div
              class="content"
              :style="{ margin: shrink ? '15px 0 20px' : '5px 0 10px' }"
            >
              <text
                v-for="(str, i) in textProcessing(detail.post.content)"
                :key="i"
                @click="i % 2 != 0 ? jumpPost(str) : () => {}"
                :class="{ link: i % 2 != 0 }"
              >
                {{ str }}
              </text>
            </div>
            <div
              class="images"
              style="padding: 5px 0"
              v-if="!isEmptyUrls(detail.post.image_urls)"
            >
              <div
                v-for="(url, index) in detail.post.image_urls"
                :key="url"
                class="image"
              >
                <el-image
                  style="width: 100px; height: 100px"
                  :src="cal_image(url)"
                  :preview-src-list="cal_images(detail.post.image_urls)"
                  :initial-index="index"
                  fit="cover"
                  preview-teleported="true"
                />
              </div>
            </div>
            <div style="display: flex; margin: 15px 5px 0">
              <div class="fav">
                <el-icon :size="16"><Star /></el-icon>
                <text>{{ detail.post.fav_count }}</text>
              </div>
              <div class="like">
                <img src="../assets/likes.svg" alt="" /><text>{{
                  detail.post.like_count
                }}</text>
              </div>
              <div class="comment">
                <el-icon :size="16"><ChatLineRound /></el-icon
                ><text>{{ detail.post.comment_count }}</text>
                <div class="forbid" v-if="!detail.post.commentable">
                  <img src="../assets/forbid.svg" alt="" />
                </div>
                <text class="tip" v-if="!detail.post.commentable">{{
                  shrink ? "禁评" : "禁评中..."
                }}</text>
              </div>
              <div style="flex: 1"></div>
              <div class="time">
                <text>{{ detail.post.created_at }}</text>
              </div>
            </div>
          </div>

          <div v-if="detail.post.type == 1 && detail.replies.length">
            <div class="divider"><div>回复详情</div></div>
            <div
              v-for="(reply, index) in detail.replies"
              :key="reply.id"
              class="reply"
              :style="{ marginLeft: index == 0 ? '8px' : '38px' }"
            >
              <div class="header">
                <div class="reply-sender" v-if="reply.sender == 0">
                  <div
                    class="sender"
                    :style="{
                      height: shrink ? '21px' : '24px',
                      lineHeight: shrink ? '21px' : '24px',
                    }"
                  >
                    <el-icon style="margin-right: 5px"><Avatar /></el-icon>
                    <text>楼主</text>
                  </div>
                  <div class="time" style="margin-left: 10px">
                    {{ timeFromNow(reply.created_at) }}
                  </div>
                </div>
                <div class="reply-sender" v-else>
                  <img
                    src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fblog.tsyzz.com%2Fupload%2F2016%2F0525%2F0156061529.png&refer=http%3A%2F%2Fblog.tsyzz.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1645766520&t=f5b635f791a4727dfadad840d5cc2875"
                    alt=""
                  />
                  <div>
                    <div class="department">
                      {{ detail.post.department?.name }}
                    </div>
                    <div class="time">{{ reply.created_at }}</div>
                  </div>
                </div>
              </div>
              <div class="content" v-html="reply.content" />
              <div class="images" v-if="!isEmptyUrls(reply.image_urls)">
                <div
                  v-for="(url, index) in reply.image_urls"
                  :key="url"
                  class="image"
                >
                  <el-image
                    style="width: 100px; height: 100px"
                    :src="cal_image(url)"
                    :preview-src-list="cal_images(reply.image_urls)"
                    :initial-index="index"
                    fit="cover"
                    preview-teleported="true"
                  />
                </div>
              </div>
              <div
                style="display: flex; align-items: center; margin: 0 5px"
                v-if="index == 0"
              >
                楼主评分：
                <el-rate
                  v-model="detail.post.rating"
                  disabled
                  show-score
                  text-color="#ff9900"
                  score-template="{value} / 5.0"
                />
              </div>
            </div>
          </div>

          <div class="divider">
            <div>用户评论</div>
            <div style="flex: 1"></div>
            <button class="btn-ori btns modify" @click="seeOwner">
              <el-icon style="margin-right: 5px"
                ><View color="#ffffff" /></el-icon
              >{{
                floors_query.only_owner == 1
                  ? shrink
                    ? "全部"
                    : "全部楼层"
                  : shrink
                  ? "楼主"
                  : "只看楼主"
              }}
            </button>
            <button class="btn-ori btns modify" @click="changeSort">
              <el-icon style="margin-right: 5px"
                ><Sort color="#ffffff" /></el-icon
              >{{ floors_query.order == 1 ? "时间倒序" : "时间正序" }}
            </button>
          </div>
          <div v-if="detail.floors.length">
            <div v-for="floor in detail.floors" :key="floor.id">
              <div
                :class="[
                  'floor',
                  floor.is_deleted ? 'is-deleted' : '',
                  floor.id == postParam.prosecuted_floor_id ? 'prosecuted' : '',
                  floor.id == postParam.user_record_floor_id
                    ? 'userRecord'
                    : '',
                ]"
              >
                <div class="header">
                  <el-dropdown trigger="click" :hide-on-click="false">
                    <div
                      class="sender"
                      :style="{
                        height: shrink ? '21px' : '24px',
                        lineHeight: shrink ? '21px' : '24px',
                      }"
                    >
                      <el-icon class="icon"><Avatar /></el-icon>
                      <text class="ellipsis"
                        >{{
                          `${
                            floor.nickname?.length
                              ? floor.nickname
                              : "没名字的微友"
                          } `
                        }}{{
                          detail.post.type == 1
                            ? `(${floor.uid})`
                            : ` [ uid: ${floor.uid} ]`
                        }}</text
                      >
                    </div>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item @click="diary(floor.uid)">
                          用户日志
                        </el-dropdown-item>
                        <el-dropdown-item
                          @click="resetName(floor.uid, floor.id)"
                          divided
                        >
                          重置昵称
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>

                  <div style="flex: 1"></div>
                  <div style="display: flex; align-items: center">
                    <div class="more" v-if="!detail.post.is_deleted">
                      <el-dropdown trigger="click" :hide-on-click="false">
                        <el-icon class="icon"><MoreFilled /></el-icon>
                        <template #dropdown>
                          <el-dropdown-menu>
                            <el-dropdown-item>
                              <el-popconfirm
                                :title="
                                  floor.commentable
                                    ? '确认禁止评论？'
                                    : '确认允许评论？'
                                "
                                @confirm="
                                  mfCommentable(floor.id, floor.commentable)
                                "
                                :icon="InfoFilled"
                                icon-color="#626AEF"
                              >
                                <template #reference>
                                  <button class="dropdown-btn">
                                    <text
                                      style="width: 100%; text-align: center"
                                    >
                                      {{
                                        floor.commentable
                                          ? "禁止评论"
                                          : "允许评论"
                                      }}
                                    </text>
                                  </button>
                                </template>
                              </el-popconfirm>
                            </el-dropdown-item>

                            <el-dropdown-item divided v-if="!floor.is_deleted">
                              <button
                                class="dropdown-btn"
                                @click="
                                  dialog('删除原因', {
                                    type: 'floor',
                                    is_deleted: floor.is_deleted,
                                    itemId: floor.id,
                                    option: 0,
                                  })
                                "
                              >
                                <text style="width: 100%; text-align: center"
                                  >删除评论</text
                                >
                              </button>
                            </el-dropdown-item>
                            <el-dropdown-item divided v-else>
                              <el-popconfirm
                                title="确认恢复该评论？"
                                @confirm="
                                  deleteInfo = {
                                    type: 'floor',
                                    is_deleted: floor.is_deleted,
                                    itemId: floor.id,
                                    option: 0,
                                  };
                                  deleteHandler();
                                "
                                :icon="InfoFilled"
                                icon-color="#626AEF"
                              >
                                <template #reference>
                                  <button class="dropdown-btn">
                                    <text
                                      style="width: 100%; text-align: center"
                                      >恢复评论</text
                                    >
                                  </button>
                                </template>
                              </el-popconfirm>
                            </el-dropdown-item>
                          </el-dropdown-menu>
                        </template>
                      </el-dropdown>
                    </div>
                  </div>
                </div>

                <div class="content">
                  <text
                    v-for="(str, i) in textProcessing(floor.content)"
                    :key="i"
                    @click="i % 2 != 0 ? jumpPost(str) : () => {}"
                    :class="{ link: i % 2 != 0 }"
                  >
                    {{ str }}
                  </text>
                </div>
                <div class="images" v-if="floor.image_url">
                  <div class="image">
                    <el-image
                      style="width: 100px; height: 100px"
                      :src="cal_image(floor.image_url)"
                      :preview-src-list="cal_images([floor.image_url])"
                      :initial-index="0"
                      fit="cover"
                      :infinite="false"
                      preview-teleported="true"
                    />
                  </div>
                </div>
                <div style="display: flex; margin: 3px 5px 0">
                  <div class="like">
                    <img src="../assets/likes.svg" alt="" /><text>{{
                      floor.like_count
                    }}</text>
                  </div>
                  <div class="comment">
                    <el-icon><ChatLineRound /></el-icon
                    ><text>{{ floor.sub_floor_cnt }}</text>
                    <div class="forbid" v-if="!floor.commentable">
                      <img src="../assets/forbid.svg" alt="" />
                    </div>
                    <text class="tip" v-if="!floor.commentable">{{
                      shrink ? "禁评" : "禁评中..."
                    }}</text>
                  </div>
                  <div style="flex: 1"></div>
                  <div class="time">
                    <text>{{ floor.created_at }}</text>
                  </div>
                </div>
              </div>
              <div v-if="floor.sub_floors">
                <div
                  v-for="sub in floor.sub_floors"
                  :key="sub.id"
                  :class="[
                    'sub',
                    sub.is_deleted ? 'is-deleted' : '',
                    sub.id == postParam.prosecuted_floor_id ? 'prosecuted' : '',
                    sub.id == postParam.user_record_floor_id
                      ? 'userRecord'
                      : '',
                  ]"
                >
                  <div class="header">
                    <el-dropdown trigger="click" :hide-on-click="false">
                      <div
                        class="sender"
                        :style="{
                          height: shrink ? '21px' : '24px',
                          lineHeight: shrink ? '21px' : '24px',
                        }"
                      >
                        <el-icon class="icon"><Avatar /></el-icon>
                        <text class="ellipsis"
                          >{{
                            `${
                              sub.nickname?.length
                                ? sub.nickname
                                : "没名字的微友"
                            } `
                          }}{{
                            detail.post.type == 1
                              ? `(${sub.uid})`
                              : ` [ uid: ${sub.uid} ]`
                          }}</text
                        >
                      </div>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item @click="diary(sub.uid)">
                            用户日志
                          </el-dropdown-item>
                          <el-dropdown-item
                            @click="resetName(sub.uid, floor.id)"
                            divided
                          >
                            重置昵称
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </template>
                    </el-dropdown>

                    <div style="flex: 1"></div>
                    <div style="display: flex; align-items: center">
                      <div class="more" v-if="!detail.post.is_deleted">
                        <el-dropdown trigger="click" :hide-on-click="false">
                          <el-icon class="icon"><MoreFilled /></el-icon>
                          <template #dropdown>
                            <el-dropdown-menu>
                              <el-dropdown-item v-if="!sub.is_deleted">
                                <button
                                  class="dropdown-btn"
                                  @click="
                                    dialog('删除原因', {
                                      type: 'sub',
                                      is_deleted: sub.is_deleted,
                                      itemId: sub.id,
                                      option: 0,
                                    })
                                  "
                                >
                                  <text style="width: 100%; text-align: center"
                                    >删除评论</text
                                  >
                                </button>
                              </el-dropdown-item>
                              <el-dropdown-item v-else>
                                <el-popconfirm
                                  title="确认恢复该评论？"
                                  @confirm="
                                    deleteInfo = {
                                      type: 'sub',
                                      is_deleted: sub.is_deleted,
                                      itemId: sub.id,
                                      option: 0,
                                    };
                                    deleteHandler();
                                  "
                                  :icon="InfoFilled"
                                  icon-color="#626AEF"
                                >
                                  <template #reference>
                                    <button class="dropdown-btn">
                                      <text
                                        style="width: 100%; text-align: center"
                                        >恢复评论</text
                                      >
                                    </button>
                                  </template>
                                </el-popconfirm>
                              </el-dropdown-item>
                            </el-dropdown-menu>
                          </template>
                        </el-dropdown>
                      </div>
                    </div>
                  </div>

                  <div class="content">
                    <text style="color: #909399; margin-right: 10px">
                      回复：{{ sub.reply_to_name }}
                    </text>
                    <text
                      v-for="(str, i) in textProcessing(sub.content)"
                      :key="i"
                      @click="i % 2 != 0 ? jumpPost(str) : () => {}"
                      :class="{ link: i % 2 != 0 }"
                    >
                      {{ str }}
                    </text>
                  </div>
                  <div class="images" v-if="sub.image_url">
                    <div class="image">
                      <el-image
                        style="width: 100px; height: 100px"
                        :src="cal_image(sub.image_url)"
                        :preview-src-list="cal_images([sub.image_url])"
                        :initial-index="0"
                        fit="cover"
                        :infinite="false"
                        preview-teleported="true"
                      />
                    </div>
                  </div>
                  <div style="display: flex; margin: 3px 5px 0">
                    <div class="like">
                      <img src="../assets/likes.svg" alt="" /><text>{{
                        sub.like_count
                      }}</text>
                    </div>
                    <div style="flex: 1"></div>
                    <div class="time">{{ timeFromNow(sub.created_at) }}</div>
                  </div>
                </div>
                <div
                  class="showTotalSubs"
                  @click="showTotalSubs(floor.id, floor.sub_floor_cnt)"
                  v-if="floor.sub_floor_cnt > floor.sub_floors.length"
                >
                  查看回复详情<el-icon class="icon"><ArrowRightBold /></el-icon>
                </div>
              </div>
            </div>
          </div>
          <div class="loadmore" v-if="loadMoreTip">
            {{ loadMoreTip }}
          </div>
        </div>
      </el-scrollbar>
      <div
        class="toTop"
        @click="() => toTop()"
        :style="{ transform: _scrollTop == 0 ? 'scale(0)' : 'scale(1)' }"
      >
        <el-icon class="icon"><Top /></el-icon>
      </div>
    </div>
  </div>

  <el-dialog
    v-model="showDialog"
    :width="dialogTitle == '删除原因' ? '330px' : '300px'"
    center
    draggable
  >
    <template #title="{ titleId, titleClass }">
      <div class="dialog-header">
        <h4 :id="titleId" :class="titleClass">
          <img
            src="../assets/etag-fill.svg"
            alt=""
            v-if="dialogTitle == '标签'"
          />
          <el-icon v-else-if="dialogTitle == '移动分区'"><Switch /></el-icon>
          <img
            src="../assets/tag.svg"
            alt="#"
            v-else-if="dialogTitle == '更改话题'"
          />
          <text style="margin-left: 10px">{{ dialogTitle }}</text>
        </h4>
      </div>
    </template>
    <div v-if="dialogTitle == '标签'" class="refine">
      <div class="holder" v-if="detail.post.e_tag">
        <div style="margin-left: 12px">当前模式：</div>
        <div style="margin-left: 12px">
          {{
            detail.post.e_tag == "top"
              ? "置顶帖"
              : detail.post.e_tag == "recommend"
              ? "加精帖"
              : detail.post.e_tag == "theme"
              ? "活动帖"
              : "null"
          }}
        </div>
      </div>
      <div class="holder" style="justify-content: center" v-else>
        <div>模式：</div>
        <el-radio-group v-model="refineMode">
          <el-radio :label="0">置顶</el-radio>
          <el-radio :label="1">加精</el-radio>
          <el-radio :label="2">活动</el-radio>
        </el-radio-group>
      </div>
      <div v-if="refineMode == 0" class="input">
        <div class="tip">请输入置顶权值，0~30000之内</div>
        <el-input
          v-model="detail.post.value"
          placeholder="权值 0~30000"
          @keyup.enter="refineHandler(detail.post.value)"
        />
      </div>
    </div>
    <div v-else-if="dialogTitle == '移动分区'" class="transfer">
      <text>移动到：</text>
      <el-select v-model="transferType" style="width: 120px">
        <el-option
          v-for="_type in GlobalData.postTypes.filter((type) => type.id != 0)"
          :label="_type.shortname"
          :value="_type.id"
          :disabled="_type.id == 1 || _type.id == detail.post.type"
        />
      </el-select>
    </div>
    <div v-else-if="dialogTitle == '更改话题'" class="modifyTag">
      <div class="input">
        <div class="tip">将话题“{{ detail.post.tag?.name }}”更改为：</div>
        <el-select
          v-model="newTag"
          filterable
          remote
          placeholder="在已有话题中搜索🔍..."
          :remote-method="remoteSearchTags"
          :loading="tagLoading"
          style="width: 100%"
        >
          <el-option
            v-for="item in tagResults"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </div>
    </div>
    <div v-else-if="dialogTitle == '删除原因'" class="delete">
      <el-radio-group v-model="deleteReason">
        <el-radio v-for="reason in GlobalData.reasons" :label="reason" />
      </el-radio-group>
    </div>
    <div v-else>hahahaha</div>
    <template #footer>
      <span class="dialog-footer" v-if="dialogTitle == '标签'">
        <el-button
          @click="refineHandler('cancel')"
          v-if="detail.post.e_tag"
          style="border: 1px solid #dcdfe6"
          >撤出</el-button
        >
        <el-button
          @click="refineHandler(detail.post.value)"
          type="primary"
          v-if="
            !(detail.post.e_tag == 'recommend' || detail.post.e_tag == 'theme')
          "
          >确认</el-button
        >
      </span>
      <span class="dialog-footer" v-else-if="dialogTitle == '移动分区'">
        <el-button @click="transferHandler" type="primary">确认</el-button>
      </span>
      <span class="dialog-footer" v-else-if="dialogTitle == '更改话题'">
        <el-button @click="tagHandler" type="primary">确认</el-button>
      </span>
      <span class="dialog-footer" v-else-if="dialogTitle == '删除原因'">
        <el-button @click="showDialog = false" style="border: 1px solid #dcdfe6"
          >取消</el-button
        >
        <el-button @click="deleteHandler" type="primary">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  getPost,
  getFloors,
  getFloor,
  getSubFloors,
  getReplies,
  deletePost,
  recoverPost,
  modifyPostCommentable,
  deletePostImage,
  deleteFloor,
  recoverFloor,
  modifyFloorCommentable,
  getTags,
  deleteTag,
  setTag,
  setTop,
  setEtag,
  transferPost,
  resetNickname,
} from "@/api/api";
import {
  Post,
  Reply,
  Floor,
  useGlobalData,
  usePost,
  Posts_query,
} from "@/store";
import { timeFromNow } from "@/utils/time";
import {
  ArrowLeftBold,
  ArrowRightBold,
  Avatar,
  Star,
  ChatLineRound,
  InfoFilled,
  MoreFilled,
  Place,
  View,
  Sort,
  Top,
  Switch,
} from "@element-plus/icons-vue";
import { ElMessage, ElScrollbar } from "element-plus";
const route = useRoute();
const router = useRouter();
const GlobalData = useGlobalData();
const postParam = usePost();

var detail = reactive({
  post: <Post>{},
  replies: <Reply[]>[],
  floors: <Floor[]>[],
});
var showLoad = ref<boolean>(true);
interface Floors_query {
  post_id: number | unknown;
  order?: number | null; //为1时时间正序 默认时间倒序
  only_owner?: number | null; //为1只看楼主
  page: number; //页数，默认0
  page_size: number; //分页数量，默认10
  page_base?: number; //	从第n个开始获取
  page_disable?: number | null; //为1取消分页
}

var post_id: unknown;
watch(
  route,
  () => {
    if (route.path == "/detail") {
      post_id = route.query.id;
      setTimeout(() => {
        initPage();
      }, 100);
    }
  },
  {
    deep: true,
    immediate: true,
  }
);

var floors_query = reactive<Floors_query>({
  post_id,
  order: 1,
  only_owner: null,
  page: 1,
  page_size: 10,
});

var scrollbarHeight = ref<number>(0);
var shrink = ref<boolean>(false);

watch(GlobalData, () => initParam(), { immediate: true });

function initParam() {
  scrollbarHeight.value = GlobalData.height - 53;
  shrink.value = GlobalData.width <= 720;
}
function initPage() {
  showPost();
  showReplies();
  floors_query.page = 1;
  detail.floors = [];
  showFloors();
}
function showPost() {
  getPost({ id: post_id }).then((res: any) => {
    let created_at = timeFromNow(res.post.created_at);
    let rating = res.post.rating / 2;
    detail.post = { ...res.post, created_at, rating };
  });
}
function showReplies() {
  getReplies({ post_id }).then((res: any) => {
    console.log(res);
    if (res.list != null)
      res.list.forEach((reply: Reply) => {
        let created_at = timeFromNow(reply.created_at);
        detail.replies.push({ ...reply, created_at });
      });
  });
}
function showFloors() {
  showLoad.value = true;
  getFloors(floors_query).then((res: any) => {
    if (res.total) {
      res.list.forEach((floor: Floor) => {
        let created_at = timeFromNow(floor.created_at);
        let sub_floors = sortByTimestream(floor.sub_floors, "created_at");
        detail.floors.push({ ...floor, created_at, sub_floors });
      });
      if (res.total < floors_query.page_size)
        loadMoreTip.value = "--- 没有更多数据 ---";
    } else loadMoreTip.value = "--- 暂无用户评论 ---";
    showLoad.value = false;
  });
}
function updateFloor(floor_id: number) {
  let oldFloor = detail.floors.filter((floor) => floor.id == floor_id)[0];
  let index = detail.floors.indexOf(oldFloor);
  getFloor({ floor_id }).then((res: any) => {
    let created_at = timeFromNow(res.floor.created_at);
    let sub_floors = sortByTimestream(res.floor.sub_floors, "created_at");
    let newFloor = { ...res.floor, created_at, sub_floors } as Floor;
    detail.floors.splice(index, 1, newFloor);
  });
}

function mpCommentable() {
  modifyPostCommentable({
    post_id: detail.post.id,
    commentable: detail.post.commentable ? 0 : 1,
  }).then(() => initPage());
}
function deletePostImg() {
  deletePostImage({ post_id: detail.post.id }).then(() => initPage());
}
function mfCommentable(floor_id: number, bool: boolean) {
  showLoad.value = true;
  modifyFloorCommentable({
    floor_id,
    commentable: bool ? 0 : 1,
  }).then(() => {
    updateFloor(floor_id);
    showLoad.value = false;
  });
}

type TagItem = {
  id: number;
  name: string;
};
type DeleteInfo = {
  type: string;
  is_deleted: boolean;
  itemId: number;
  option: number;
};
var showDialog = ref<boolean>(false);
var dialogTitle = ref<string>("");
var refineMode = ref<number | null>(0);
var transferType = ref<number>(0);
var newTag = ref<string | number>("");
var tagResults = ref<TagItem[]>([]);
var tagLoading = ref<boolean>(false);
var deleteInfo = ref<DeleteInfo | null>({
  type: "",
  is_deleted: false,
  itemId: 0,
  option: 0,
});
var deleteReason = ref<string>("");

function dialog(title: string, actionObj: any) {
  dialogTitle.value = title;
  if (title == "标签")
    refineMode.value =
      detail.post.e_tag == "top"
        ? 0
        : detail.post.e_tag == "recommend"
        ? 1
        : detail.post.e_tag == "theme"
        ? 2
        : null;
  else if (title == "移动分区") transferType.value = detail.post.type;
  else if (title == "删除原因") {
    deleteReason.value = "";
    deleteInfo.value = actionObj;
  }
  showDialog.value = true;
}

function refineHandler(value: number | string) {
  if (refineMode.value === null) ElMessage.warning("请先选择模式！");
  else {
    if (refineMode.value === 0)
      setTop({
        post_id: detail.post.id,
        value: value == "cancel" ? 0 : value,
      }).then(() => {
        showDialog.value = false;
        showPost();
      });
    else
      setEtag({
        post_id: detail.post.id,
        value: value == "cancel" ? 0 : refineMode.value,
      }).then(() => {
        showDialog.value = false;
        showPost();
      });
  }
}
function transferHandler() {
  if (transferType.value == detail.post.type)
    ElMessage.warning("帖子分区未改变！");
  else
    transferPost({
      post_id: detail.post.id,
      new_type_id: transferType.value,
    }).then(() => {
      showDialog.value = false;
      showPost();
    });
}

function remoteSearchTags(query: string) {
  if (query) {
    tagLoading.value = true;
    getTags({ name: query }).then((res: any) => {
      console.log(res);
      tagResults.value = res.list;
      tagLoading.value = false;
    });
  } else tagResults.value = [];
}

function tagHandler() {
  if (typeof newTag.value != "number") ElMessage.warning("请选择一个已有话题!");
  else
    deleteTag({ post_id }).then(() => {
      setTag({
        post_id: detail.post.id,
        tag_id: newTag.value,
      }).then(() => {
        showDialog.value = false;
        newTag.value = "";
        showPost();
      });
    });
}

function deleteHandler() {
  showLoad.value = true;
  if (deleteInfo.value?.type == "post") {
    if (!deleteInfo.value.is_deleted) {
      if (!deleteReason.value.length) ElMessage.warning("请选择一个删除原因！");
      else
        deletePost({
          id: deleteInfo.value.itemId,
          reason: deleteReason.value,
        }).then(() => router.go(-1));
    } else {
      recoverPost({
        post_id: deleteInfo.value.itemId,
      }).then(() => {
        showDialog.value = false;
        showPost();
        showLoad.value = false;
      });
    }
  } else if (deleteInfo.value?.type == "floor") {
    if (!deleteInfo.value.is_deleted) {
      if (!deleteReason.value.length) ElMessage.warning("请选择一个删除原因！");
      else
        deleteFloor({
          floor_id: deleteInfo.value.itemId,
          reason: deleteReason.value,
        }).then(() => {
          showDialog.value = false;
          let floor_id = deleteInfo.value?.itemId as number;
          updateFloor(floor_id);
          showLoad.value = false;
        });
    } else {
      recoverFloor({
        floor_id: deleteInfo.value.itemId,
      }).then(() => {
        showDialog.value = false;
        let floor_id = deleteInfo.value?.itemId as number;
        updateFloor(floor_id);
        showLoad.value = false;
      });
    }
  } else if (deleteInfo.value?.type == "sub") {
    if (!deleteInfo.value.is_deleted) {
      if (!deleteReason.value.length) ElMessage.warning("请选择一个删除原因！");
      else
        deleteFloor({ floor_id: deleteInfo.value.itemId }).then(() => {
          showDialog.value = false;
          let floor_id = deleteInfo.value?.option as number;
          updateFloor(floor_id);
          showLoad.value = false;
        });
    } else {
      recoverFloor({
        floor_id: deleteInfo.value.option,
      }).then(() => {
        showDialog.value = false;
        let floor_id = deleteInfo.value?.option as number;
        updateFloor(floor_id);
        showLoad.value = false;
      });
    }
  } else showLoad.value = false;
}

function resetName(uid: number, belongId: number) {
  showLoad.value = true;
  if (belongId)
    resetNickname({ uid }).then(() => {
      ElMessage.success("重置昵称成功");
      updateFloor(belongId);
      showLoad.value = false;
    });
  else
    resetNickname({ uid }).then(() => {
      ElMessage.success("重置昵称成功");
      showPost();
      showLoad.value = false;
    });
}

function cal_type(typeId: number) {
  let item = GlobalData.postTypes.filter((type) => type.id == typeId)[0];
  if (item) return item.shortname;
  else return "";
}
function cal_image(url: string) {
  return import.meta.env.VITE_IMAGE_BASE_URL + "/download/origin/" + url;
}
function cal_images(urls: string[]) {
  let arr: string[] = [];
  let baseUrl = import.meta.env.VITE_IMAGE_BASE_URL;
  urls.forEach((url) => {
    arr.push(baseUrl + "/download/origin/" + url);
  });
  return arr;
}
function getImgSrc(name: string) {
  const path = `/src/assets/${name}`;
  const modules = import.meta.globEager("/src/assets/*");
  return modules[path].default;
}
function isEmptyUrls(arr: any) {
  if (arr) return arr.length <= 0 || arr[0].length <= 0;
  else return true;
}
function textProcessing(content: any) {
  if (typeof content == "string") {
    let splitArr = content.split("#MP");
    let contentArr = [splitArr[0]];
    for (let i = 1; i < splitArr.length; i++) {
      let id = splitArr[i].substring(0, 6);
      if (parseInt(id)) {
        let link = `#MP${id}`;
        let str = splitArr[i].replace(id, "");
        contentArr.push(link, str);
      } else contentArr.push(splitArr[i]);
    }
    return contentArr;
  } else return [];
}
function jumpPost(mpid: string) {
  let id = parseInt(mpid.split("#MP")[1]);
  router.push({ path: "/detail", query: { id } });
}

function seeOwner() {
  floors_query.only_owner == 1
    ? (floors_query.only_owner = null)
    : (floors_query.only_owner = 1);
  floors_query.page = 1;
  detail.floors = [];
  showFloors();
}
function changeSort() {
  floors_query.order == 1
    ? (floors_query.order = null)
    : (floors_query.order = 1);
  floors_query.page = 1;
  detail.floors = [];
  showFloors();
}
var loadMoreTip = ref<string>("");
function loadMore() {
  loadMoreTip.value = "";
  if (detail.floors.length == floors_query.page * 10) {
    floors_query.page++;
    showFloors();
  } else loadMoreTip.value = "--- 没有更多数据 ---";
}
const scrollbar = ref<InstanceType<typeof ElScrollbar>>();
function toTop() {
  scrollbar.value?.setScrollTop(0);
}
var _scrollTop = ref<number>(0);
type scroll = {
  scrollLeft: number;
  scrollTop: number;
};
function getScrollTop({ scrollTop }: scroll) {
  _scrollTop.value = scrollTop == 0 ? 0 : 1;
}
function showTotalSubs(floor_id: number, size: number) {
  getSubFloors({ floor_id, page_size: size }).then((res: any) => {
    let oldFloor = detail.floors.filter((floor) => floor.id == floor_id)[0];
    let index = detail.floors.indexOf(oldFloor);
    detail.floors[index].sub_floors = sortByTimestream(res.list, "created_at");
  });
}
function sortByTimestream(arr: any, key: string) {
  return arr.sort(function (a: any, b: any) {
    var xx = a[key];
    var xy = b[key];
    return xx > xy ? 1 : xx < xy ? -1 : 0;
  });
}

const query_init = <Posts_query>{
  type: 0,
  search_mode: 1,
  solved: null,
  department_id: null,
  content: "",
  tag_id: null,
  etag: "",
  value_mode: 0,
  commentable: null,
  is_deleted: 0,
};
function searchDepa() {
  let department_id = detail.post.department?.id as number;
  postParam.$patch((state) => {
    state.posts_query = { ...query_init, type: 1, department_id };
  });
  router.push("/content");
}
function searchTag() {
  let tag_id = detail.post.tag?.id as number;
  postParam.$patch((state) => {
    state.posts_query = { ...query_init, tag_id };
  });
  router.push("/content");
}
function searchPart() {
  let type = detail.post.type as number;
  postParam.$patch((state) => {
    state.posts_query = { ...query_init, type };
  });
  router.push("/content");
}

function diary(uid: number) {
  router.push({
    path: "/diary",
    query: { uid },
  });
}
</script>

<style lang="less" scoped>
.post {
  padding: 12px 12px 8px;
  margin: 0 8px;
  border-radius: 12px;
  box-shadow: 0 0px 4px rgb(0 21 41 / 5%);
}
.header {
  display: flex;
  margin-left: -5px;
}
.sender {
  padding: 0 15px 0 5px;
  margin-right: 7px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  font-size: 14px;
  background-color: #f4f4f5;
  cursor: pointer;
  .icon {
    width: 24px;
    height: 24px;
  }
}
.reply-sender {
  display: flex;
  align-items: center;
  img {
    width: 45px;
    height: auto;
    margin-right: 5px;
  }
  .department {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 3px;
  }
  .time {
    color: #909399;
  }
}
.title {
  font-size: 18px;
  line-height: 24px;
  margin: 10px 0;
  .etag {
    height: 20px;
    margin-right: 7px;
    font-size: 14px;
    padding: 0 5px;
    border-radius: 4px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transform: translateY(-2px);
    text {
      line-height: 20px;
      color: white;
    }
  }
}
.solved {
  margin-right: 10px;
  height: 24px;
  line-height: 24px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: bold;
  display: inline-flex;
  transform: translateY(5px);
  .icon {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: #363c54;
    transform: scale(calc(15 / 24));
    img {
      width: 24px;
      transform: scale(calc(20 / 24));
    }
  }
}
.depa,
.tag,
.part,
.campus,
.extra-tag {
  background-color: #f4f4f5;
  margin-right: 7px;
  padding-right: 10px;
  height: 24px;
  line-height: 24px;
  border-radius: 12px;
  font-size: 14px;
  display: flex;
  .icon {
    width: 24px;
    height: 24px;
    font-size: 24px;
    border-radius: 50%;
    background-color: white;
    transform: scale(calc(17 / 24));
    img {
      width: 24px;
      transform: scale(calc(17 / 24));
    }
    .el-icon {
      transform: scale(calc(20 / 24));
    }
  }
}
.tag {
  cursor: pointer;
  .icon > img {
    transform: scale(calc(15 / 24));
  }
}
.depa {
  cursor: pointer;
  .icon {
    background-color: #363c54;
    img {
      transform: scale(calc(15 / 24));
    }
  }
}
.part {
  cursor: pointer;
}
.extra-tag {
  cursor: pointer;
  img {
    width: 14px;
    margin: 0 3px 0 10px;
  }
}
.dialog-header {
  h4 {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  img {
    width: 18px;
  }
}
.refine {
  .holder {
    display: flex;
    align-items: center;
  }
  .input {
    margin: 10px 10px 6px;
    .tip {
      margin: 20px 0 15px 0;
      color: grey;
    }
  }
}
.transfer {
  margin: 20px 0;
  display: flex;
  align-items: center;
  text {
    margin: 0 30px 0 20px;
  }
}
.modifyTag {
  .input {
    margin: 10px 10px 6px;
    .tip {
      margin: 10px 0 15px;
      color: black;
    }
  }
}
.delete {
  .el-radio-group {
    display: block;
    .el-radio {
      margin-bottom: 15px;
    }
  }
}
.more {
  width: 14px;
  height: 14px;
  cursor: pointer;
  margin-left: 6px;
  .icon {
    font-size: 14px;
    transform: rotate(90deg);
  }
}
.time {
  font-size: 14px;
}
.fav,
.like,
.comment {
  display: flex;
  align-items: center;
  margin-right: 5px;
  color: #005187;
  font-size: 14px;
  transform: scale(1);
  img {
    width: 16px;
  }
  text {
    margin: 0 5px;
    color: black;
  }
  .forbid {
    position: fixed;
    top: -2px;
    left: -4px;
    z-index: -1;
    img {
      width: 24px;
      height: 24px;
    }
  }
  .tip {
    color: red;
  }
}
.content {
  margin: 5px 5px 10px;
  font-size: 16px;
  word-break: break-all;
}
.images {
  display: flex;
  .image {
    margin-right: 8px;
  }
}
.reply {
  padding: 12px 12px 8px;
  margin: 8px;
  border-radius: 12px;
  box-shadow: 0 0px 4px rgb(0 21 41 / 5%);
}
.floor {
  padding: 12px 12px 8px;
  margin: 8px;
  border-radius: 12px;
  box-shadow: 0 0px 4px rgb(0 21 41 / 5%);
}
.sub {
  padding: 12px 12px 8px;
  margin: 8px;
  margin-left: 38px;
  border-radius: 12px;
  box-shadow: 0 0px 4px rgb(0 21 41 / 5%);
}
.floor,
.sub {
  .content {
    margin: 10px 0;
  }
}
.showTotalSubs {
  font-size: 14px;
  font-weight: bold;
  color: #005187;
  margin-left: 48px;
  height: 32px;
  line-height: 32px;
  display: flex;
  align-items: center;
  cursor: pointer;
  .icon {
    margin-left: 5px;
  }
}
.loadmore {
  width: 100%;
  height: 60px;
  line-height: 60px;
  text-align: center;
  color: #005187;
}
.toTop {
  position: fixed;
  bottom: 42px;
  right: 42px;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  box-shadow: 0 0 3px #005187;
  background-color: #005187;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.5s;
  .icon {
    color: white;
    transform: scale(1.2);
  }
}
.divider {
  font-weight: bold;
  font-size: 14px;
  margin: 8px 28px;
  color: #005187;
  display: flex;
  align-items: center;
}
.divider :first-child {
  height: 32px;
  line-height: 32px;
}
.btn-ori {
  font-size: 14px;
  border: none;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.btns {
  width: 80px;
  height: 32px;
  box-shadow: 1px 1px 3px rgba(125, 159, 204, 0.5);
  background-color: #005187;
  margin: 8px 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
  color: white;
}
.modify {
  width: auto;
  margin: 0 0 0 12px;
  padding: 0 11px 0 9px;
}
.dropdown-btn {
  width: 100%;
  height: 100%;
  text-align: center;
  font-size: 14px;
  color: #606266;
  border: none;
  outline: none;
  background-color: transparent;
  padding: 0;
}
.top {
  background-image: linear-gradient(to right bottom, #ef6947, #cf4624);
  box-shadow: 0 0 1px #cf4624;
  opacity: 0.8;
}
.recommend {
  background-image: linear-gradient(to right bottom, #e9aa22, #eb8d2e);
  box-shadow: 0 0 1px #eb8d2e;
  opacity: 0.8;
}
.theme {
  background-image: linear-gradient(to right bottom, #4096e3, #3b60ec);
  box-shadow: 0 0 1px #3b60ec;
  opacity: 0.8;
}
.is-deleted {
  text {
    text-decoration: line-through;
    color: rgb(99, 99, 99);
  }
}
.prosecuted {
  border: 2px dashed red;
}
.userRecord {
  border: 2px dashed #005187;
}
.link {
  color: #005187;
  text-decoration: underline;
  cursor: pointer;
}
.ellipsis {
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
@media screen and (max-width: 500px) {
  .content {
    font-size: 14px;
  }
}
</style>
<style lang="less">
.el-radio {
  margin-right: 10px;
  .el-radio__inner {
    border: 1px solid #dcdfe6;
  }
}
.delete {
  .el-radio__label {
    white-space: pre-line;
  }
}
</style>
