cmake_minimum_required(VERSION 3.16)

# Set your project name and version
project(polyterm VERSION 1.0 LANGUAGES CXX)

# Enable C++17 or later
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Find Qt packages (Qt5; swap for Qt6 if you prefer)
find_package(Qt5 REQUIRED COMPONENTS Widgets)

# Find Python interpreter, libraries, and headers
find_package(Python3 REQUIRED COMPONENTS Interpreter Development)

# Add your executable
add_executable(${PROJECT_NAME} main.cpp)

# Include Python headers
target_include_directories(${PROJECT_NAME} PRIVATE ${Python3_INCLUDE_DIRS})

# Link Qt and Python libraries
target_link_libraries(${PROJECT_NAME} Qt5::Widgets ${Python3_LIBRARIES})

# Copy the fetch_events.py file to the build directory
configure_file(${CMAKE_SOURCE_DIR}/fetch_events.py ${CMAKE_BINARY_DIR}/fetch_events.py COPYONLY)

