@echo off

echo.
echo.
set SPRING_DATASOURCE_URL=jdbc:oracle:thin:@(description=(retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=adb.mx-queretaro-1.oraclecloud.com))(connect_data=(service_name=g79dfc4c0a09ae5_ociprojectdevelopment_high.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))?TNS_ADMIN=C:\Users\roxar\Documents\SextoSem\Wallet_OCIProjectDevelopment
set SPRING_DATASOURCE_USERNAME=TODOUSER
set SPRING_DATASOURCE_PASSWORD=Password123456
set TELEGRAM_BOT_TOKEN=7735491116:AAFyZS7e2G0iZVzPP-79w9GRS-gK0WdSgBc
set TELEGRAM_BOT_NAME=botimus

echo.
mvn spring-boot:run

pause
