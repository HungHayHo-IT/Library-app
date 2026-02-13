package com.example.Library_app.config;

import com.example.Library_app.entity.Book;
import org.springframework.context.annotation.Configuration;

import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
//chặn các thao tác chỉnh sửa dữ liệu (Thêm, Sửa, Xóa) và chỉ cho phép xem dữ liệu.

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

    private String theAllowedOrigins = "http://localhost:3000"; //Cho phép frontend React chạy ở port 3000 gọi API

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config , CorsRegistry cors){
        HttpMethod[] theUnsupportedActions = {
                HttpMethod.POST,
                HttpMethod.PATCH,
                HttpMethod.DELETE,
                HttpMethod.PUT
        };

        config.exposeIdsFor(Book.class);// yeu cau spring data rest hien thi khoa chinh cua entity trong ket qua json
        disableHttpMethods(Book.class,config,theUnsupportedActions);
        // configure cors mapping
        cors.addMapping(config.getBasePath()+"/**")
                .allowedOrigins(theAllowedOrigins);
    }

    private void disableHttpMethods(Class<Book> theClass, RepositoryRestConfiguration config, HttpMethod[] theUnsupportedActions) {
        config.getExposureConfiguration()
                .forDomainType(theClass) // ap dung cho class book
                .withItemExposure(((metdata, httpMethods) ->httpMethods.disable(theUnsupportedActions) ))
                .withCollectionExposure(((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions)));;
    }


}
