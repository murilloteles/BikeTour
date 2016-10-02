export class Notificacao{
  constructor(
    public id?: number,
    public tipo_notificacao?: number,
    public descricao?: string,
    public latitude?: number,
    public longitude?: number,
    public data?: string
  ){}
}
