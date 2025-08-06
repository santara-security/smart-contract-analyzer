from setuptools import setup, find_packages

setup(
    name="santara_plugin",
    version="0.1",
    packages=find_packages(),
    install_requires=["slither-analyzer"],
    entry_points={
        "slither_plugins": [
            "santara_plugin = santara_plugin:make_plugin"
        ]
    },
    description="Santara Slither plugin.",
    author="Your Name",
)
