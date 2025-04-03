@echo off

echo.
set SPRING_DATASOURCE_URL=jdbc:oracle:thin:@(description=(retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=adb.mx-queretaro-1.oraclecloud.com))(connect_data=(service_name=g79dfc4c0a09ae5_ociprojectdevelopment_high.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))?TNS_ADMIN=C:/Users/juana/OneDrive/Escritorio/Wallet_OCIProjectDevelopment
set SPRING_DATASOURCE_USERNAME=TODOUSER
set SPRING_DATASOURCE_PASSWORD=Password123456
set TELEGRAM_BOT_TOKEN=7877925032:AAFudrWkK0s7AUH_XgR9_NJK5iA8ac6YFtU
set TELEGRAM_BOT_NAME=OracleJavaT45_bot

echo.
C:\Users\juana\Downloads\apache-maven-3.9.9-bin\apache-maven-3.9.9\bin\mvn.cmd spring-boot:run

pause
