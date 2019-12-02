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
      <el-col :span="12">
        <EasyPlayer :videoUrl="videoUrl" fluent autoplay live stretch></EasyPlayer>
        <el-input v-model="input" placeholder="请输入播放地址" size="mini"></el-input>
        <el-button class="player-button" size="mini" type="success" @click="player">播放</el-button>
      </el-col>
      <el-col :span="12">
          <div class="control-box">
            <span @click="testControl('zoomin')"><i class="el-icon-circle-plus-outline"></i></span>
            <span @click="testControl('up')"><i class="el-icon-arrow-up"></i></span>
            <span @click="testControl('zoomout')"><i class="el-icon-remove-outline"></i></span>
            <span @click="testControl('left')"><i class="el-icon-arrow-left"></i></span>
            <span @click="testControl('stop')">停止</span>
            <span @click="testControl('right')"><i class="el-icon-arrow-right"></i></span>
            <span></span>
            <span @click="testControl('down')"><i class="el-icon-arrow-down"></i></span>
            <span></span>
          </div>
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
        videoUrl:'',
        input:'',
        channelNum:0,
      }
    },
    components:{
      EasyPlayer
    },
    mounted() {},
    methods: {
      player(){
        this.videoUrl = this.input
        this.channelNum = parseInt(this.input[this.input.indexOf('_') + 1])
        
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
      },
      testControl(data) {
        this.$axios.get('/api/v1/ptzcontrol', {
            params: {
              channel: this.channelNum,
              command: data
            }
          })
          .then((response) => {
            // console.log(response)
          })
          .catch((error) => {
            console.log(error)
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
  .el-row, .div-btn{
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
  .control-box {
    width: 180px;
    height: 180px;
    margin: 50px;
    span {
      display: inline-block;
      text-align: center;
      float: left;
      width: 60px;
      height: 60px;
      padding: 5px;
      border-radius: 50%;
      box-sizing: border-box;
      // border: 1px solid #ccc;
      line-height: 50px;
      cursor: pointer;
      &:hover {
        background-color: #67C23A;
         border: none;
      }
    }
  }
</style>