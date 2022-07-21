interface iUser {
  id?: number;
  email?: string;
  password?: string;
  created_at?: Date;
  updated_at?: Date;
  role?: string;
  team_id?: number;
  deleted?: boolean;
}

export default iUser;
