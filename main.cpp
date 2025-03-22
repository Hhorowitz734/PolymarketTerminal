#include <Python.h>
#include <QJsonDocument>
#include <QJsonObject>
#include <QJsonArray>
#include <QDebug>
#include <QApplication>
#include <QMainWindow>
#include <QPushButton>
#include <QVBoxLayout>
#include <QLabel>
#include <QWidget>

QString callGetEvents() {
    static bool pythonInitialized = false;

    if (!pythonInitialized) {
        Py_Initialize();
        PyRun_SimpleString("import sys; sys.path.append('.')");
        pythonInitialized = true;
    }

    PyObject *pName = PyUnicode_DecodeFSDefault("fetch_events");
    PyObject *pModule = PyImport_Import(pName);
    Py_DECREF(pName);

    if (pModule != nullptr) {
        PyObject *pFunc = PyObject_GetAttrString(pModule, "get_data");

        if (PyCallable_Check(pFunc)) {
            PyObject *pValue = PyObject_CallObject(pFunc, nullptr);

            if (pValue != nullptr) {
                QString result = PyUnicode_AsUTF8(pValue);
                Py_DECREF(pValue);
                Py_DECREF(pFunc);
                Py_DECREF(pModule);
                return result;
            } else {
                PyErr_Print();
            }

            Py_XDECREF(pFunc);
            Py_DECREF(pModule);
        } else {
            PyErr_Print();
        }
    } else {
        PyErr_Print();
    }

    return "Error calling Python";
}

int main(int argc, char* argv[]) {
    QApplication app(argc, argv);

    QMainWindow window;
    window.setWindowTitle("Polyterm");

    QWidget *centralWidget = new QWidget();
    QVBoxLayout *layout = new QVBoxLayout();

    QLabel *label = new QLabel("Press the button to load events.");
    QPushButton *button = new QPushButton("Fetch Events");

    layout->addWidget(button);
    layout->addWidget(label);
    centralWidget->setLayout(layout);
    window.setCentralWidget(centralWidget);

    QObject::connect(button, &QPushButton::clicked, [&]() {
        QString jsonResult = callGetEvents();
        label->setText(jsonResult.left(500) + "..."); // Display first 500 chars
        qDebug() << jsonResult;
    });

    window.showMaximized();

    return app.exec();
}
