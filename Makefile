NAME=.params.js

all: $(NAME)

$(NAME):
	@touch $(NAME)

clean:
	@rm -Rf ./.params.js

fclean:			clean

re:				fclean all

.PHONY: all, clean, fclean, re
