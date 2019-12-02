<template>
  <div id="app">
     <h1 ref="admin"></h1>
    <div>
      <span>用户：</span>
      <el-input size="mini" placeholder="用户名" suffix-icon="el-icon-date" v-model="username">
      </el-input>
    </div>
    <div>
      <span>密码：</span>
      <el-input size="mini" placeholder="密码" suffix-icon="el-icon-date" v-model="password">
      </el-input>
    </div>
    <el-button type="success" @click="login">测试登录</el-button>
    <el-button type="success" @click="loginout">测试退出</el-button>
    <el-button type="success" @click="testapi">测试鉴权</el-button>
    <h2 ref="status"></h2>
  </div>
</template>

<script>
  import md5 from "md5";
  export default {
    data() {
      return {
        username: "admin",
        password: "admin",
      }
    },
    mounted(){
      this.$refs.admin.innerHTML = "未登录"
    },
    methods: {
      login() {
       if(!this.username || !this.password){
        this.$message({
          message: '用户名或密码不能为空！',
          type: 'warning'
        });
       }else {
         this.$axios.get('/api/v1/login', {
            params: {
              username: this.username,
              password: md5(this.username)
            }
          })
          .then((response) => {
            this.$message({
              message: '恭喜你，登录成功！',
              type: 'success'
            });
            this.$refs.admin.innerHTML = "已登录"
          })
          .catch((error) => {
            this.$message.error('用户名或密码错误，登录失败！');
          });
        }
      },
      loginout() {
        this.$axios.get('/api/v1/logout')
          .then((response) => {
            this.$message({
              message: '成功退出！',
              type: 'success'
            });
            this.$refs.admin.innerHTML = "未登录"
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
            this.$refs.status.innerHTML = response.status + "OK"
          })
          .catch((error) => {
            this.$refs.status.innerHTML = ""
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
    text-align: center;
    color: #2c3e50;
  }
  p {
    margin: auto;
    text-align: left;
    max-width: 600px;
  }

  .el-input {
    max-width: 300px;
    margin: 15px 0;
  }
</style>