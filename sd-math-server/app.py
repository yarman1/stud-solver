from flask import Flask, request, jsonify
import sys
from multiprocessing import Process, Queue
from python_solvers.integral import solve_integral

app = Flask(__name__)

def solve_integral_wrapper(expression, lower_limit, upper_limit, is_decimal, output_queue):
    try:
        latex_expression, solution = solve_integral(expression, lower_limit, upper_limit, is_decimal)
        output_queue.put((latex_expression, solution))
    except Exception as e:
        output_queue.put(("Error", str(e)))

@app.route('/solve-integral', methods=['POST'])
def solve_integral_route():
    data = request.json
    expression = data.get('expression')
    lower_limit = data.get('lowerLimit', None)
    upper_limit = data.get('upperLimit', None)
    is_decimal = data.get('isDecimal', False)

    output_queue = Queue()

    process = Process(target=solve_integral_wrapper, args=(expression, lower_limit, upper_limit, is_decimal, output_queue))
    process.start()

    process.join()
    latex_expression, solution = output_queue.get()

    if latex_expression == "Error":
        return jsonify({"error": solution}), 400

    result = {
        "expression": latex_expression,
        "result": solution,
    }
    return jsonify(result)

# flask run --port=7000
if __name__ == '__main__':
    app.run(debug=True)
