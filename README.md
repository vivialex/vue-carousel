[vue-carousel]: https://vivialex.github.io/demo/imageCarousel/index.html

# vue-carousel (mobile)

## Demo-例子
[vue-carousel]

## Import-引入
```Javascript
import Vue from 'vue';
import imageClipper from 'path/carousel/index'
Vue.use(carousel);
```

## Use-使用
```HTML
<carousel :proportion="16/9" pagination-type="fraction" @change="change">
    <carousel-item>one</carousel-item>
    <carousel-item>two</carousel-item>
    <carousel-item>three</carousel-item>
     
    <p slot="other">other</p>
</carousel>
```

## Slot-插槽
除了**carousel-item**外，如果要插入其他元素或者组件，请加上**slot="other"** 

## Options-选项
| Option | Default | Type | Description
| ------ | ------- | ---- | --------- |
| [`width`] |  | Number | carousel的宽度 
| [`height`] |  | Number | carousel的高度
| [`proportion`] |  | Number | carousel的宽高比
| [`interval`] | 3000 | Number | 轮播间隔，单位为ms
| [`autoPlay`] | true | Boolean | 是否启动轮播
| [`paginationHide`] | false | Boolean | 是否隐藏分页器
| [`paginationType`] | bullets | String | 分页器类型
| [`paginationAlign`] | right | String | 分页器水平位置，left center right
| [`listData`] |  | Array | 

#### 部分Options说明
1. **width**： 如果不指定，carousel默认的宽度为外层容器的宽度
2. **height**：如果同时传入**height**与**proportion**，则**height**优先，如果都不传入，默认为宽度的一半
3. **proportion**：使用carousel轮播图片的时候，特别有用
3. **paginationType**：目前类型有**bullets(圆点)**、**fraction(分式)**，其它效果请利用**slot与监听change事件实现**
4. **listData**：如果是使用Array循环渲染carousel-item，建议传入该Array，这样当Array发生变化时，carousel就能作出相应的更新

## Events-事件
| Name | Args | Description
| -----| ---- | -----------|
| change | currentIndex当前索引 | 切换后触发
