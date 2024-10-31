class LoginController < ApplicationController
  def login
    #users = User.where("login = '#{user_params[:login]}' AND password = '#{user_params[:password]}'").first

    users = User.find_by "login = ? AND password = ?", user_params[:login], user_params[:password]
    
    if users
      render json: {message: "Zalogowano: " + users.login}
    else
      render json: {message: "Zle dane"}
    end
  end

  private

  def user_params
    params.permit(:login, :password)
  end
end