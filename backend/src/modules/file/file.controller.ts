import { extname, join } from 'node:path';
import { existsSync, mkdirSync } from 'node:fs';
import { BadRequestException, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';

const AVATAR_DIR = join(process.cwd(), 'uploads', 'avatars');

@ApiTags('文件管理')
@Controller('files')
@ApiBearerAuth()
export class FileController {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  constructor() {
    if (!existsSync(AVATAR_DIR)) {
      mkdirSync(AVATAR_DIR, { recursive: true });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Post('avatar')
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: () => AVATAR_DIR,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        filename: (_req, file, callback) => {
          const timestamp = Date.now();
          const random = Math.random().toString(36).substring(2, 8);
          const uniqueName = `${timestamp}-${random}${extname(file.originalname)}`;
          callback(null, uniqueName);
        }
      }),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      fileFilter: (_req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return callback(new BadRequestException('只支持图片格式：jpg, jpeg, png, gif, webp'), false);
        }
        return callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024
      }
    })
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: '上传头像' })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  uploadAvatar(@UploadedFile() file?: any): { url: string; filename: string; originalname: string; size: number } {
    if (!file) {
      throw new BadRequestException('请选择要上传的文件');
    }

    return {
      url: `/uploads/avatars/${file.filename}`,
      filename: file.filename,
      originalname: file.originalname,
      size: file.size
    };
  }
}
