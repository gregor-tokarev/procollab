/** @format */

import { User } from "@auth/models/user.model";
import * as dayjs from "dayjs";

export class ChatMessage {
  id!: number;
  sender!: User;
  content!: string;
  time!: string;

  static default(): ChatMessage {
    return {
      sender: User.default(),
      time: dayjs().format("YYYY-MM-DD hh:mm:ss"),
      content:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt dolor excepturi iste, sunt suscipit voluptates? A ad aliquid aspernatur, at delectus dolore dolores doloribus eligendi fuga fugit incidunt, magni possimus quasi quod sapiente sint sunt? A amet beatae doloribus dolorum est iure, maxime obcaecati perspiciatis vero. Fugit molestiae neque, omnis provident sed temporibus vel? Accusamus aliquam, amet asperiores cupiditate enim exercitationem harum hic impedit in ipsa magnam minus molestiae necessitatibus neque nisi nulla numquam optio pariatur quaerat quam, quis quisquam rem saepe sapiente sunt totam voluptate. Autem, inventore, placeat! Aperiam cumque dolor eaque minus neque quasi quis repellat. Adipisci asperiores cumque illum, in libero magni nihil quod. Beatae blanditiis distinctio expedita illo iusto libero maxime neque odio odit provident, quis totam velit voluptate. Assumenda, deleniti ex fugiat in, non perferendis perspiciatis possimus praesentium quas quasi quis quos repellendus repudiandae sequi sunt tenetur veritatis? Alias architecto dolores expedita sequi voluptatibus? A alias aperiam asperiores atque distinctio, error eum eveniet ipsam laudantium nobis omnis perferendis perspiciatis possimus quasi quia repudiandae sit unde velit? Alias enim est ipsa vel voluptatem? Accusamus commodi delectus est minus molestias natus, reprehenderit rerum sit voluptas voluptatem! A ad minima neque nulla officiis quia quisquam repellat repudiandae, sunt!",
      id: 1,
    } as ChatMessage;
  }
}