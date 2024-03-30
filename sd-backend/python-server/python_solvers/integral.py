import sympy as sp
from sympy.parsing.sympy_parser import (parse_expr, standard_transformations,
                                        implicit_multiplication_application, convert_equals_signs)

# Set up the transformations including implicit multiplication
transformations = (standard_transformations +
                   (implicit_multiplication_application, convert_equals_signs,))

def parse_limit(limit_str):
    if limit_str == 'inf':
        return sp.oo
    elif limit_str == '-inf':
        return -sp.oo
    else:
        try:
            # Use transformations to parse other limits
            return parse_expr(limit_str, transformations=transformations)
        except Exception as e:
            raise ValueError(f"Invalid limit: {limit_str}. Error: {str(e)}")

def validate_expression(expr_str):
    try:
        corrected_expr_str = expr_str.replace("^", "**")
        # Parse and validate the expression
        expr = parse_expr(corrected_expr_str, transformations=transformations)
        return expr
    except Exception as e:
        raise ValueError(f"Invalid expression: {expr_str}. Error: {str(e)}")

def solve_integral(expression_str, lower_limit_str=None, upper_limit_str=None, is_decimal=False):
    x = sp.symbols('x')

    # Validate and parse the expression and limits
    expr = validate_expression(expression_str)
    lower_limit = parse_limit(lower_limit_str) if lower_limit_str else None
    upper_limit = parse_limit(upper_limit_str) if upper_limit_str else None

    latex_expression = sp.latex(expr)

    # Compute the definite integral only if limits are provided
    if lower_limit is not None and upper_limit is not None:
        # Compute the definite integral
        definite_integral_result = sp.integrate(expr, (x, lower_limit, upper_limit))

        # Check for divergence or unevaluated integral
        if definite_integral_result is sp.S.Infinity or definite_integral_result is sp.S.NegativeInfinity:
            solution = "Divergent (Infinity)"
        elif isinstance(definite_integral_result, sp.Integral):
            solution = "Divergent or unable to compute definite integral"
        else:
            if is_decimal:
                solution = sp.latex(definite_integral_result.evalf())
            else:
                solution = sp.latex(definite_integral_result)
    else:
        # Compute the indefinite integral
        indefinite_integral_expr = sp.integrate(expr, x)
        solution = sp.latex(indefinite_integral_expr)

    return latex_expression, solution
