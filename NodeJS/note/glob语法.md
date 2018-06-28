####glob 语法

#####*

> 匹配任意个字符

##### ?

> 匹配一个字符

##### [...]

> 匹配范围内的字符

##### !(pattern1|pattern2)

> 匹配取反

#####?(pattern1|pattern2)

> 匹配0个或1个

#####+(pattern1|pattern2)

> 匹配1个或多个

匹配 `pattern1` 或 `pattern2` 或者两个一起

##### *(a|b|c)

> 匹配任意个

匹配 `a` 或 `b` 或 `c`

##### @(pattern|pat*|pat?erN)

> 匹配特定的一个

匹配 `pattern` 或 `pat开头的` 或 `pat开头erN结尾的`

##### **

> 任意层级匹配

#### 例子

```javascript
'src/**/*'
// src目录以及src子目录下的所有文件
```

