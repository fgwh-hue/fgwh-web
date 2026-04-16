import { Injectable, NotFoundException } from '@nestjs/common';
import { AnnouncementRepository } from './announcement.repository';
import type { CreateAnnouncementDto } from './dto/create-announcement.dto';
import type { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import type { QueryAnnouncementDto } from './dto/query-announcement.dto';
import type { AnnouncementListResponse, AnnouncementResponse } from './entities/announcement-response';

@Injectable()
export class AnnouncementService {
  constructor(private readonly announcementRepository: AnnouncementRepository) {}

  async create(dto: CreateAnnouncementDto, authorId: string): Promise<AnnouncementResponse> {
    return this.announcementRepository.create({ ...dto, authorId });
  }

  async findAll(query: QueryAnnouncementDto): Promise<AnnouncementListResponse> {
    return this.announcementRepository.findAll(query);
  }

  async findOne(id: string): Promise<AnnouncementResponse> {
    const announcement = await this.announcementRepository.findById(id);
    if (!announcement) {
      throw new NotFoundException('公告不存在');
    }
    await this.announcementRepository.incrementViewCount(id);
    return announcement;
  }

  async update(id: string, dto: UpdateAnnouncementDto): Promise<AnnouncementResponse> {
    const announcement = await this.announcementRepository.update(id, dto);
    if (!announcement) {
      throw new NotFoundException('公告不存在');
    }
    return announcement;
  }

  async remove(id: string): Promise<{ message: string }> {
    const announcement = await this.announcementRepository.delete(id);
    if (!announcement) {
      throw new NotFoundException('公告不存在');
    }
    return { message: '删除成功' };
  }
}
