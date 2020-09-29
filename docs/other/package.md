# Java 打包
Java 打包流程目前还不是特别熟悉，目前摸索出来的一套打包方式即是直接使用 maven 的 install 命令打包，然后添加 docker 插件，运行完以后会自动打出镜像，流程如下。

## 示例流程
> 前提：先安装好 docker。

1. 在 pom.xml 中添加 **docker-maven-plugin** 插件
```XML
<plugins>
    <plugin>
        <groupId>com.spotify</groupId>
        <artifactId>docker-maven-plugin</artifactId>
        <version>1.0.0</version>
        <configuration>
            <!-- 镜像名称 -->
            <imageName>${project.artifactId}:develop-${project.version}-${maven.build.timestamp}</imageName>
            <!-- Dockerfile 所在的目录，起始位置在当前项目根目录，即与 src 目录同级 -->
            <dockerDirectory>docker</dockerDirectory>
            <resources>
                <resource>
                    <targetPath>/</targetPath>
                    <directory>${project.build.directory}</directory>
                    <include>${project.build.finalName}.jar</include>
                </resource>
            </resources>
        </configuration>
        <!-- 添加以后在 maven install 流程中会自动运行 Dockerfile 进行镜像打包 -->
        <executions>
            <execution>
                <id>build-image</id>
                <phase>package</phase>
                <goals>
                    <goal>build</goal>
                </goals>
            </execution>
        </executions>
    </plugin>
</plugins>
```

## 总结
目前只是简单记录一下，打包流程以后还需再仔细研究下。