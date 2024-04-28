import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { json } from "body-parser";

/* 
  Run the application
*/
async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    // Binding Global Pipes
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
      })
    );
    app.use(json({ limit: "2mb" }));

    const config = new DocumentBuilder()
      .setTitle("Test API")
      .setDescription("The API description")
      .setVersion("1.0")
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("docs", app, document);

    await app.listen(process.env.PORT || 5000);
  } catch (err) {}
}
bootstrap();
