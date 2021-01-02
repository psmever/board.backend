# NicePage board.Backend

## board Back-End Source.


### Sequelize Migrate
`
> reset
sequelize db:drop && sequelize db:create && sequelize db:migrate && sequelize db:seed:all

> create model
sequelize model:create --name users --attributes "id:integer, user_id:string, password:string"

>migration:create

sequelize migration:create --name codes

> seed
sequelize seed:create --name codes
sequelize db:seed:all
`


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
