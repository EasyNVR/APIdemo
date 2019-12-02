<template>
  <div id="app">
    <div class="div-btn">
      <el-button-group>
        <el-button size="mini" type="success" @click="login">测试登录</el-button>
        <el-button size="mini" type="success" @click="loginout">测试退出</el-button>
        <el-button size="mini" type="success" @click="testapi">测试鉴权</el-button>
      </el-button-group>
    </div>
    <el-row>
      <el-col :span="24">
        <EasyPlayer :videoUrl="videoUrl" fluent autoplay live stretch></EasyPlayer>
        <el-input v-model="input" placeholder="请输入播放地址接口" size="mini"></el-input>
        <p>列如：http://127.0.0.1:10800/api/v1/getchannelstream?channel=1&protocol=RTMP</p>
        <el-button class="player-button" size="mini" type="success" @click="player">播放</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import md5 from "md5";
  import EasyPlayer from "easy-player"
  export default {
    data() {
      return {
        videoUrl: '',
        input: '',
        timer: 0,
        channels: '',
        protocols: ''

      }
    },
    components: {
      EasyPlayer
    },
    mounted() {},
    methods: {
      player() {
        if(!this.input){
          this.$message.error('请输入接口地址！');
        }else{
          let strs = this.input.split('?')[1].split('&')
          for (const iterator of strs) {
            if (iterator.indexOf('channel') != -1) this.channels = parseInt(iterator.split('=')[1])
            if (iterator.indexOf('protocol') != -1) this.protocols = iterator.split('=')[1]
          }
          this.play()
        }
      },
      play() {
        this.$axios.get('/api/v1/getchannelstream', {
            params: {
              channel: this.channels,
              protocol: this.protocols
            }
          })
          .then((response) => {
            this.videoUrl = response.data.EasyDarwin.Body.URL
            this.timer = setInterval(() => {
              this.touchStream();
            }, 30 * 1000);
            if(!response.data.EasyDarwin.Body.URL)this.$message.error('播放失败！');
          })
          .catch((error) => {
            let { status } = error.response
            if (status == 401) Message.error('token值无效，请重新登录')
          });
      },
      touchStream() {
        this.$axios.get('/api/v1/touchchannelstream', {
            params: {
              channel: this.channels,
              protocol: this.protocols
            }
          })
          .then((response) => {
            this.videoUrl = response.data.EasyDarwin.Body.URL
            if(!response.data.EasyDarwin.Body.URL)this.$message.error('播放失败！');
          })
          .catch((error) => {
            let { status } = error.response
            if (status == 401) Message.error('token值无效，请重新登录')
          });
      },
      login() {
        this.$axios.get('/api/v1/login', {
            params: {
              username: "admin",
              password: md5("admin")
            }
          })
          .then((response) => {
            this.$message({
              message: '恭喜你，登录成功！',
              type: 'success'
            });
          })
          .catch((error) => {
            this.$message.error('用户名或密码错误，登录失败！');
          });
      },
      loginout() {
        this.$axios.get('/api/v1/logout')
          .then((response) => {
            this.$message({
              message: '成功退出！',
              type: 'success'
            });
          })
          .catch((error) => {
            console.log(error)
          });
      },

      testapi() {
        this.$axios.get('/api/v1/getchannelsconfig', {
            params: {
              start: 0,
              limit: 1
            }
          })
          .then((response) => {
            this.$message({
              message: '鉴权成功！',
              type: 'success'
            });
          })
          .catch((error) => {
            this.$message.error('鉴权失败！');
          });
      }
    }
  }
</script>

<style lang="scss">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    // text-align: center;
    color: #2c3e50;
  }

  .el-row,
  .div-btn {
    max-width: 800px;
    margin: auto;
  }

  .div-btn {
    padding: 5px 0;
  }

  .el-col {
    min-height: 300px;
    // border: 1px pink solid
  }

  .el-input {
    padding: 5px;
    box-sizing: border-box;
  }

  .player-button {
    margin: 5px;
    width: 100%;
  }
  p {
    font-size: 12px;
    color: #67c23a;
  }
  .el-input__inner:focus {
    border-color: #67c23a !important;
  }
</style>