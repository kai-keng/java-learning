# 行为型-命令模式

## 定义
给一系列不同的命令定义一个接口，再把这些命令分别定义成不同的实现接口的类，在控制器中传入命令接口，通过设置不同的命令，可以在控制器中自由控制需要执行的命令，达到解耦的目的，非常类似于策略模式。

## 与策略模式的不同
浅显的来看，策略模式是封装易变化的部分，通过不同情况替换不同的策略，都是为了达到同一个目的，命令模式则是封装不同的命令，执行不同的命令达到不同的目的。

## 实现
与策略模式相似